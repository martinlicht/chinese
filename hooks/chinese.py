
import hashlib
import html
import re


ZH_RE = re.compile(r"\{\{zh:(.+?)\}\}")


def audio_filename(text: str) -> str:
    h = hashlib.sha256(text.encode("utf-8")).hexdigest()[:16]
    return f"/audio/zh/{h}.mp3"


def render_zh(match: re.Match) -> str:
    text = match.group(1).strip()

    visible = html.escape(text)
    attr_text = html.escape(text, quote=True)
    audio = html.escape(audio_filename(text), quote=True)

    return (
        f'<span class="zh-sample" lang="zh-CN">'
        f'{visible}'
        f'<button class="zh-play" '
        f'type="button" '
        f'data-text="{attr_text}" '
        f'data-audio="{audio}" '
        f'aria-label="Play Chinese audio"></button>'
        f'</span>'
    )

# f'aria-label="Play Chinese audio">▶</button>' # old version of the button


def on_page_markdown(markdown, page, config, files):
    return ZH_RE.sub(render_zh, markdown)

