import 'server-only';

/** Bestätigungsmail des Double-Opt-ins — im Marken-Look, wie das Kontaktformular. */

const COLORS = {
  night: '#0f1813',
  forest: '#1b2a21',
  cream: '#faf7f1',
  creamSoft: '#f3ede2',
  brass: '#c9a96a',
  text: '#2a3e31',
};

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function confirmMailHtml(data: {
  intro: string;
  cta: string;
  note: string;
  url: string;
  dir: 'ltr' | 'rtl';
}): string {
  return `<!doctype html>
<html dir="${data.dir}">
<body style="margin:0;padding:0;background:${COLORS.creamSoft};font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.creamSoft};padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${COLORS.cream};border-radius:6px;overflow:hidden;">
        <tr>
          <td style="background:${COLORS.night};padding:28px 32px;text-align:center;">
            <div style="color:${COLORS.cream};font-size:22px;letter-spacing:1px;">Black Forest Retreats</div>
            <div style="color:${COLORS.brass};font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-top:6px;">Newsletter</div>
          </td>
        </tr>
        <tr><td style="padding:36px 32px;color:${COLORS.text};font-size:15px;line-height:1.6;text-align:center;">
          <p style="margin:0 0 26px;">${esc(data.intro)}</p>
          <a href="${esc(data.url)}" style="display:inline-block;background:${COLORS.brass};color:${COLORS.night};text-decoration:none;padding:14px 30px;border-radius:3px;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">${esc(data.cta)}</a>
          <p style="margin:26px 0 0;font-size:13px;color:${COLORS.text};opacity:.7;">${esc(data.note)}</p>
        </td></tr>
        <tr>
          <td style="background:${COLORS.forest};padding:20px 32px;text-align:center;">
            <div style="color:${COLORS.cream};font-size:12px;opacity:.8;">Black Forest Retreats · Neuenbürg</div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
