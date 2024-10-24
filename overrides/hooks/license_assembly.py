# sourcery skip: avoid-global-variables, do-not-use-staticmethod
"""
Assembles license content for all license pages.

TODO: We can probably make more use of pyMarkdown to handle the processing of the license text; need to investigate further. We can also make much better use of mkdocs-macros to handle the processing of the license text.
"""

import json
import logging
import re
from datetime import datetime, timezone
from copy import copy
from functools import cached_property
from pathlib import Path
from re import Match, Pattern
from typing import Any, ClassVar, Literal

import ez_yaml
from hook_logger import get_logger
from jinja2 import Template, TemplateError
from license_canary import LicenseBuildCanary
from mkdocs.config.base import Config as MkDocsConfig
from mkdocs.plugins import event_priority
from mkdocs.structure.files import File, Files, InclusionLevel
from mkdocs.structure.pages import Page

# Change hook-level logging here
_assembly_log_level = logging.DEBUG

if not hasattr(__name__, "assembly_logger"):
    assembly_logger = get_logger(
        "ASSEMBLER",
        _assembly_log_level,
    )

def get_canary() -> LicenseBuildCanary:
    """Returns the LicenseBuildCanary instance."""
    return LicenseBuildCanary.canary()

def clean_content(content: dict[str, Any]) -> dict[str, Any] | None:
    """
    Strips whitespace from string values in a dictionary, and from strings in lists.

    Args:
        content (Any): The dictionary to clean.

    Returns:
        dict[str, Any]: The cleaned dictionary with whitespace removed from string values.

    Examples:
        cleaned_content = clean_content({"title": "  Example Title  ", "tags": ["  tag1  ", "tag2 "]})
    """

    def cleaner(value: Any) -> str:
        """Strips whitespace from a string."""
        if isinstance(value, dict):
            return {k: cleaner(v) for k, v in value.items()}
        elif isinstance(value, list):
            return [cleaner(item) for item in value]
        elif isinstance(value, str):
            return value.strip()
        return value

    cleaned_content = {k: cleaner(v) if v else "" for k, v in content.items()}
    assembly_logger.debug("Cleaned content: %s", cleaned_content)
    return cleaned_content

def render_mapping(mapping: dict[str, Any], context: dict):
    """Renders a dict/mapping with a context."""

    def render_value(value):
        """Recursively render a value."""
        if isinstance(value, str):
            try:
                return Template(value).render(**context)
            except (TypeError, TemplateError) as e:
                assembly_logger.error("Error rendering mapping: %s", e)
                return value
        elif isinstance(value, dict):
            return render_mapping(value, context)
        elif isinstance(value, list):
            return [render_mapping(item, context) for item in value]
        else:
            return value
    assembly_logger.debug("Rendering mapping: %s", mapping)
    assembly_logger.debug("Context: %s", context)
    return {key: render_value(value) for key, value in mapping.items()}

def assemble_license_page(config: MkDocsConfig, page: Page, file: File) -> Page:
    """Returns the rendered boilerplate from the config."""
    page.meta = clean_content(page.meta)
    boilerplate: dict[str, str] = config.extra["boilerplate"]
    boilerplate["year"] = boilerplate.get(
        "year", datetime.now(timezone.utc).strftime("%Y")
    ).strip()
    boilerplate = clean_content(boilerplate)
    license = LicenseContent(page)
    get_canary().add_value("processed_licenses", license)
    assembly_logger.debug("All data before rendering boilerplate: %s", page.meta)
    assembly_logger.debug("Rendering boilerplate for %s", page.title)
    rendered_boilerplate = render_mapping(boilerplate, page.meta)
    page.meta |= rendered_boilerplate
    markdown = (page.markdown or "") + license.license_content
    page.markdown = Template(markdown).render(**page.meta)
    return page

def create_page_content(page: Page) -> str:
    """Creates the content for a license page."""
    frontmatter = ez_yaml.to_string(page.meta)
    if not frontmatter.startswith("---"):
        frontmatter = "---\n" + frontmatter
    if not frontmatter.endswith("---"):
        frontmatter += "\n---\n"
    return f"{frontmatter}{page.markdown or ''}"


def create_new_file(page: Page, file: File, config: MkDocsConfig) -> File:
    """Creates a new file object from a page."""
    new_file = File.generated(
        config,
        file.src_uri,
        content=create_page_content(page),
        inclusion=InclusionLevel.INCLUDED,
    )
    del page
    return new_file

def get_category(uri: str) -> str | None:
    """Returns the category of the license."""
    if split := uri.split("/"):
        if len(split) == 4:
            return split[1] if split[1] in ["proprietary", "public-domain", "copyleft", "permissive", "source-available"] else None
    return None

def filter_license_files(files: Files) -> Files:
    """Creates a new files object from the license files."""
    license_files = []
    for uri in files.src_uris:
        assembly_logger.debug("Checking URI %s", uri)
        if (file := files.src_uris[uri]) and get_category(uri) and uri.strip().lower().endswith("index.md"):
            license_files.append(file)
    return Files(license_files)

def replace_files(files: Files, new_files: Files) -> Files:
    """Replaces files in the files object."""
    for file in new_files:
        if replaced_file := files.get_file_from_path(file.src_uri):
            files.remove(replaced_file)
        files.append(file)
    return files

def on_files(files: Files, config: MkDocsConfig) -> Files:
    """
    Replaces license files with generated versions. I was doing this after Page creation but it was problematic. It's more involved, but the output fits better with MkDocs' expectations. We're also less prone to changes in MkDocs' internals.

    Args:
        files (Files): The files objects to process.
        config (MkDocsConfig): The configuration settings for MkDocs.

    Returns:
        files: The processed Files with replaced files.

    Raises:
        Exception: If there is an error during template rendering or logging.
    """
    license_files = filter_license_files(copy(files))
    if not license_files:
        assembly_logger.error("No license files found. Files: %s", files)
        raise FileNotFoundError("No license files found.")
    new_license_files = []
    for file in license_files:
        page = Page(None,file, config)
        if not page:
            assembly_logger.error("No page found for file %s", file.src_uri)
            continue
        page.read_source(config)
        assembly_logger.debug("Processing license page %s")
        parent_path = "/".join(file.src_uri.split("/")[:-1])
        changelog_file = next((f for f in files if f.src_uri == f"{parent_path}/CHANGELOG.md"), File.generated(config, f"{parent_path}/CHANGELOG.md", content="", inclusion=InclusionLevel.EXCLUDED))
        page.meta["changelog"] = changelog_file.content_string or "## such empty, much void :nounproject-doge:"
        changelog_file.inclusion = InclusionLevel.EXCLUDED
        updated_page = assemble_license_page(config, page, file)
        assembly_logger.debug("Meta after rendering and cleaning: %s", updated_page.meta)
        assembly_logger.debug("Page meta after rendering: %s", updated_page.meta)
        assembly_logger.debug("Page markdown after rendering: %s", updated_page.markdown)
        new_license_files.append(create_new_file(updated_page, file, config))
    return replace_files(files, Files(new_license_files))

@event_priority(-90)
def on_page_markdown(
    markdown_content: str, page: Page, config: MkDocsConfig, files: list[File]
) -> str:
    """
    Pipeline function for processing license content and assembling the final Markdown content for the license page.

    Args:
        markdown_content (str): The original Markdown content of the page.
        page (Page): The page object containing metadata and content.
        config (MkDocsConfig): The configuration settings for MkDocs.
        files (list[File]): A list of files associated with the documentation.

    Returns:
        str: The combined Markdown content including the original content and the rendered license information.

    Raises:
        Exception: If there is an error during template rendering or logging.
    """
    assembly_logger.info("Processing page %s in on_page_markdown", page.title)
    if not (get_canary().is_license_page(page)):
        return markdown_content
    assembly_logger.debug("Processing license page %s", page)
    assembly_logger.debug("Page meta at on_page_markdown: %s", page.meta)
    assembly_logger.debug("Page markdown at on_page_markdown: %s", markdown_content)
    return markdown_content

def load_json(path: Path) -> dict[str, Any]:
    """Loads a JSON"""
    return json.loads(path.read_text())

def write_json(path: Path, data: dict[str, Any]) -> None:
    """Writes a JSON"""
    if path.exists():
        path.unlink()
    path.write_text(json.dumps(data, indent=2))

class LicenseContent:
    """
    TODO: Break this class up into smaller classes
    Represents a license's content and metadata, including the license text and associated attributes. All license text processing happens here.
    """

    _year_pattern: ClassVar[Pattern[str]] = re.compile(r"\{\{\s{1,2}year\s{1,2}\}\}")

    def __init__(self, page: Page) -> None:
        """
        Initializes a new instance of the class with the provided page object.
        This constructor sets up various attributes related to the page's metadata, including tags,
        license type, and processed license texts, ensuring that the object is ready for further operations.

        Args:
            page (Page): The page object containing metadata and content related to the license.

        Examples:
            license_instance = LicenseClass(page)
        """

        self.page = page
        self.meta = page.meta
        self.license_type = self.get_license_type()
        self.title = f"The {self.meta['plain_name']}"
        self.year = str(datetime.now().strftime("%Y"))
        self.reader_license_text: str = self.replace_year(self.meta["reader_license_text"])
        self.markdown_license_text = self.process_mkdocs_to_markdown()
        self.plaintext_license_text = self.process_markdown_to_plaintext()
        self.changelog_text = self.meta.get("changelog", "## such empty, much void :nounproject-doge:")
        self.official_license_text = self.meta.get("official_license_text", "")
        self.plain_version = self.get_plain_version()
        self.tags = self.get_tags()

        self.has_official = bool(self.official_license_text)

    def get_license_type(self) -> Literal["dedication", "license"]:
        """
        Returns the license type based on the license metadata.
        This might seem like overkill, but it was giving me a lot of trouble with a single check.
        """
        if (self.page.title and isinstance(self.page.title, str) and "domain" in self.page.title.lower()) or (self.page and "domain" in self.page.url.lower()) or (self.meta.get("category") and "domain" in self.meta["category"].lower()):
            return "dedication"
        return "license"


    def process_markdown_to_plaintext(self) -> str:
        """
        Strips Markdown formatting from the license text to produce a plaintext version.

        Returns:
            str: The processed plaintext version of the Markdown license text.

        Examples:
            plain_text = process_markdown_to_plaintext()
        """
        text = self.markdown_license_text
        text = self.process_definitions(text, plaintext=True)
        text = re.sub(
            r"#+ |(\*\*|\*|`)(.*?)\1", r"\2", text
        )  # Remove headers, bold, italic, inline code
        text = re.sub(r"\[(.*?)\]\((.*?)\)", r"\1 (\2)", text)  # Handle links
        text = re.sub(r"!\[(.*?)\]\((.*?)\)", r"\1 (\2)", text)
        text = re.sub(r"(`{3}plaintext)", "===", text)  # Remove plaintext code blocks
        text = re.sub(r"(`{3}\s*)", "===", text)  # Remove code blocks# Handle images
        return text

    @staticmethod
    def process_definitions(text: str, plaintext: bool = False) -> str:
        """
        Identifies and processes definitions in the input text, formatting them appropriately.

        Args:
            text (str): The input text containing definitions to be processed.
            plaintext (bool, optional): A flag indicating whether to return definitions in plaintext format.
                Defaults to False.

        Returns:
            str: The processed text with definitions formatted appropriately.
        """

        definition_pattern = re.compile(
            r"(?P<term>`[\w\s]+`)\s*?\n{1,2}[:]\s{1,4}(?P<def>[\w\s]+)\n{2}",
            re.MULTILINE,
        )
        if matches := definition_pattern.finditer(text):
            assembly_logger.debug(
                f"Processing definitions: {[match.group(0) for match in matches]}"
            )
            for match in matches:
                term = match.group("term")
                def_text = match.group("def")
                replacement = (
                    f"{term.replace('`', '')}\n- {def_text}\n\n"
                    if plaintext
                    else f"{term}\n: {def_text}\n\n"
                )
                text = text.replace(match.group(0), replacement)
        if matches := re.findall(r"\{\s?\.\w+\s?\}", text):
            for match in matches:
                text = text.replace(match, "")
        return text

    def get_plain_version(self) -> str:
        """
        Retrieves the plain version of the package from a JSON file.
        This function checks for the existence of a `package.json` file in the same directory as the page URL,
        and extracts the version information, returning a default value if the file does not exist or if the version is not valid.

        Returns:
            str: The version string from the package, or "0.0.0" if the file is missing or the version is not valid.
        """
        path = Path(self.page.file.src_uri)
        path = path.parent / "package.json"
        if not path.exists():
            return "0.0.0"
        if path.exists():
            package = load_json(path)
            version = package.get("version")
            if not version:
                return "0.0.0"
            if "development" in version and LicenseBuildCanary.canary().production:
                package["version"] = "0.1.0"
                write_json(path, package)
                return "0.1.0"
        return "0.0.0"

    def transform_text_to_footnotes(self, text: str) -> str:
        """
        Transforms text by replacing annotations with footnotes and adding footnote references at the end.
        Args:
            text: The text to transform by replacing annotations with footnotes.
        Returns:
            The transformed text with annotations replaced by footnotes and footnote references added at the end.
        """

        footnotes = []

        def replacement(match: Match[str]) -> str:
            """
            Generates a footnote reference and stores the corresponding annotation.
            We replace the annotation with a footnote reference and store the annotation in a list for later use.

            Args:
                match (re.Match): The match object containing the annotation to be processed.

            Returns:
                str: A formatted string representing the footnote reference.
            """
            footnote_num = len(footnotes) + 1
            footnotes.append(match.group("annotation").strip())
            return f"[^{footnote_num}]"

        annotation_pattern: Pattern[str] = re.compile(
            r"(?P<citation>\([123]\)).*?(?P<class>\{\s\.annotate\s\})[\n\s]{1,4}[123]\.\s{1,2}(?P<annotation>.+?)\n",
            re.MULTILINE | re.DOTALL,
        )
        transformed_text = annotation_pattern.sub(replacement, text)
        if footnotes:
            transformed_text += "\n\n"
            for i, footnote in enumerate(footnotes, 1):
                transformed_text += f"[^{i}]: {footnote}\n"
        return transformed_text

    def replace_year(self, text: str) -> str:
        """
        Replaces the year placeholder in the provided text with the current year.

        Args:
            text (str): The text to process and replace the year placeholder.

        Returns:
            str: The text with the year placeholder replaced by the current year.
        """
        return type(self)._year_pattern.sub(self.year, text)


    def process_mkdocs_to_markdown(self) -> str:
        """
        Processes MkDocs content and transforms it into standard Markdown (i.e. not markdown with extensions). This function converts the text to footnotes, applies a header transformation, and processes any definitions present in the text to produce a final Markdown string.

        Note: Footnotes aren't *strictly* standard markdown, but they still look fine if you're not using a markdown processor that supports them. GitHub is the primary use case here, and it renders footnotes.

        Returns:
            str: The processed Markdown text after transformations and definitions have been applied.
        """
        assembly_logger.debug(
            "Processing mkdocs-style markdown to regular markdown for %s",
            self.meta["plain_name"],
        )
        assembly_logger.debug("Reader content: ", self.reader_license_text)
        header_pattern: Pattern[str] = re.compile(
            r'<h2 class="license-first-header">(.*?)</h2>'
        )
        text = self.reader_license_text
        text = self.transform_text_to_footnotes(text)
        assembly_logger.debug("Transformed text: %s", text)
        text = header_pattern.sub(r"## \1", text)
        return self.process_definitions(text)

    def get_tags(self) -> list[str] | None:
        """
        Retrieves a list of tags from the provided frontmatter data dictionary.

        Args:
            frontmatter (dict[str, Any]): A dictionary containing frontmatter data that may include tags, conditions, permissions, and limitations.

        Returns:
            list[str] | None: A list of mapped tags if found, or None if no valid tags are present.
        """
        possible_tags: list[list[str | None] | None] = [self.meta.get("conditions"), self.meta.get("permissions"), self.meta.get("limitations")]
        frontmatter_tags = []
        for taglist in possible_tags:
            if taglist:
                frontmatter_tags.extend(taglist)
        if frontmatter_tags:
            return [self.tag_map[tag] for tag in frontmatter_tags if tag in self.tag_map]
        return None

    @staticmethod
    def blockify(text: str, kind: str, title: str, separator_count: int = 5, options: str = "") -> str:
        """Returns a blocks api block with the provided text."""
        separator = "/" * separator_count
        option_line = f"{' ' * (separator_count + 1)}options\n\n" if options else "\n"
        return f"\n{separator} {kind} | {title}\n{option_line}{text}\n{separator}"

    def interpretation_block(self, kind: str) -> str:
        """Returns the interpretation block for the license."""
        if not self.has_official:
            return ""
        if kind == "reader":
            return self.blockify(
                f"{self.meta.get('interpretation_text')}", "note", self.meta.get("interpretation_title", ""), 4
            )
        if kind == "markdown":
            return f"""### {self.meta.get('interpretation_title')}\n\n{self.meta.get('interpretation_text')}\n\n"""
        return f"""NOTE: {self.meta.get('interpretation_title')}\n\n{self.meta.get('interpretation_text')}\n\n"""

    def get_header_block(self, kind: Literal["reader", "markdown", "plaintext"]) -> str:
        """Returns the version block for the license."""
        if kind == "reader":
            title = f"\n\n# {self.meta['plain_name'].strip()}\n\n"
            if self.meta.get("original_version"):
                version_info = f"""<div class='version-info'><span class="original-version">original version: {self.meta.get("original_version")}</span><span class="plain-version">plain version: {self.plain_version}</span></div>\n\n"""
            else:
                version_info = f"""<div class='version-info'><span class="plain-version">plain version: {self.plain_version}</span></div>\n\n"""
            return f"""<div class="license-header">{title}{version_info}</div>\n\n"""
        if kind == "markdown":
            title = f"\n\n# {self.meta.get('plain_name')}\n\n"
            if self.meta.get("original_version"):
                version_info = f"""> original version: {self.meta.get("original_version")}\n> plain version: {self.meta.get("plain_version")}\n\n"""
            else:
                version_info = f"""> plain version: {self.meta.get("plain_version")}\n\n"""
            return f"""\n\n{title}{version_info}\n\n"""
        title = f"\n\n# {self.meta.get('plain_name').upper()}\n\n"
        if self.meta.get("original_version"):
            version_info = f"""\n\noriginal version: {self.meta.get("original_version")} | plain version: {self.meta.get("plain_version")}\n\n"""
        else:
            version_info = f"""\n\nplain version: {self.meta.get("plain_version")}\n\n"""
        return f"""\n\n{title}{version_info}\n\n"""

    @cached_property
    def attributes(self) -> dict[str, Any | int | str]:
        """
        Retrieves a dictionary of attributes related to the license.
        This property consolidates various license-related information into a single dictionary,
        making it easier to access and manage the relevant data.

        Returns:
            dict[str, Any | int | str]: A dictionary containing attributes such as year,
            markdown and plaintext license texts, plain version, and license type.
        """

        return {
            "title": self.title,
            "year": self.year,
            "reader_license_text": self.reader_license_text,
            "markdown_license_text": self.markdown_license_text,
            "plaintext_license_text": self.plaintext_license_text,
            "plain_version": self.plain_version,
            "license_type": self.license_type,
            "tags": self.tags,
            "changelog": self.changelog,
            "official_license_text": self.official_license_text,
            "has_official": self.has_official,
            "final_markdown": self.license_content,
        }

    @cached_property
    def tag_map(self) -> dict[str, str]:
        """Returns the tag map for the license for setting tags."""
        return {
            "distribution": "can-share",  # allowances
            "commercial-use": "can-sell",
            "modifications": "can-change",
            "revokable": "can-revoke",
            "relicense": "relicense",
            "disclose-source": "share-source",  # requirements
            "document-changes": "describe-changes",
            "include-copyright": "give-credit",
            "same-license": "share-alike (strict)",
            "same-license--file": "share-alike (relaxed)",
            "same-license--library": "share-alike (relaxed)",
        }

    @property
    def icon_map(self) -> dict[str, str]:
        """Returns the icon map for the license tab icons."""
        return {
            "reader": ":material-book-open-variant:",
            "markdown": ":octicons-markdown-24:",
            "plaintext": ":nounproject-txt:",
            "embed": ":material-language-html5:",
            "changelog": ":material-history:",
            "official": ":material-license:",
        }

    @property
    def not_advice_text(self) -> str:
        """Returns the not advice text for the license."""
        return f"""We are not lawyers. This is not legal advice. You use this license at your own risk. If you need legal advice, talk to a lawyer.\nWe are normal people who want to make licenses accessible for everyone. We hope that our plain language helps you and anyone else (including lawyers) understand this license. If you see a mistake or want to suggest a change, please [submit an issue on GitHub]({self.meta.get("github_issues_link")} "Submit an issue on GitHub") or [submit edits to this page]({self.meta.get("github_edit_link")} "edit on GitHub").\n"""

    @property
    def not_official_text(self) -> str:
        """Returns the not official text for the license."""
        if self.has_official:
            return f"""Plain License is not affiliated with the original {self.meta['original_name'].strip()} authors or {self.meta['original_organization'].strip()}. **Our plain language versions are not official** and are not endorsed by the original authors. Our licenses may also include different terms or additional information. We try to capture the *legal meaning* of the original license, but we can't guarantee our license provides the same legal protections.\n\nIf you want to use the {self.meta['plain_name'].strip()}, you should refer to the original license text so you understand how it might be different. You can find the official {self.meta['original_name'].strip()} [here]({self.meta['original_url'].strip()} "check out the official {self.meta['original_name'].strip()}" ).\n"""
        return ""

    @property
    def disclaimer_block(self) -> str:
        """Returns the disclaimer block for the license."""
        not_advice_title = "This is not legal advice."
        not_advice = self.blockify(
            self.not_advice_text,
            "tab" if self.has_official else "warning",
            not_advice_title,
            3,
            options="open: True",
        )
        if not self.has_official:
            return not_advice
        not_official_title = f"This is not the official {self.meta.get("original_name")}"
        not_official = self.blockify(self.not_official_text, "tab", not_official_title, 3, options="open: True")
        return self.blockify(f"{not_advice}\n{not_official}\n", "details", "disclaimer", 4, "open:True")

    @property
    def reader(self) -> str:
        """Returns the reader block for the license."""
        header_block = self.get_header_block("reader")
        if self.has_official:
            text = header_block + self.replace_year(self.reader_license_text) + self.interpretation_block("reader") + self.disclaimer_block
        else:
            text = header_block + self.replace_year(self.reader_license_text) + self.disclaimer_block
        return self.blockify(text, "tab", f"reader {self.icon_map['reader']}")

    @property
    def markdown(self) -> str:
        """Returns the markdown block for the license."""
        header_block = self.get_header_block("markdown")
        text = f"""\n```markdown {header_block}{self.markdown_license_text}{self.interpretation_block("markdown")}\n```\n\n{self.disclaimer_block}"""
        return self.blockify(text, "tab", f"markdown {self.icon_map['markdown']}")

    @property
    def plaintext(self) -> str:
        """Returns the plaintext block for the license."""
        header_block = self.get_header_block("plaintext")
        text = f"""```plaintext\n\n{header_block}{self.plaintext_license_text}{self.interpretation_block("plaintext")}```\n\n{self.disclaimer_block}"""
        return self.blockify(text, "tab", f"plaintext {self.icon_map['plaintext']}")

    @property
    def changelog(self) -> str:
        """Returns the changelog block for the license."""
        return self.blockify(self.changelog_text, "tab", f"changelog {self.icon_map['changelog']}")

    @property
    def official(self) -> str:
        """Returns the official block for the license."""
        if not self.has_official:
            return ""
        text = f"""{self.official_license_text}\n""" if self.meta.get("link_in_original") else f"""{self.official_license_text}\n\n{self.meta.get("official_link")}\n"""
        return self.blockify(text, "tab", f"official {self.icon_map['official']}")

    @property
    def embed_link(self) -> str:
        """Returns the embed link for the license."""
        return f"""<iframe
    src="https://plainlicense.org/embed/{self.meta['spdx_id']}.html"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 1px solid #E4C580; border-radius: 8px; overflow: hidden auto;"
    title=f"{self.title}"
    loading="lazy"
    sandbox="allow-scripts"
    onload="if(this.contentDocument.body.scrollHeight > 400) this.style.height = this.contentDocument.body.scrollHeight + 'px';"
    referrerpolicy="no-referrer-when-downgrade">
    <p>Your browser does not support iframes. View {self.title} at:
      <a href="{self.page.url}">plainlicense.org</a>
    </p>
  </iframe>"""

    @property
    def embed(self) -> str:
        """Returns the embed block for the license."""
        return self.blockify(self.embed_link, "tab", f"html {self.icon_map['embed']}")

    @property
    def license_content(self) -> str:
        """Returns the content for a license page"""
        tabs = self.reader + self.markdown + self.plaintext + self.changelog
        if self.has_official:
            tabs += self.official
        outro = self.meta.get("outro", "")
        return self.blockify(f"{tabs}{outro}\n", "admonition license", f"Plain License\: <span class='detail-title-highlight'>The {self.meta.get('plain_name')}</span>\n", 6, options="open:True") + f"\n\n{outro}"
