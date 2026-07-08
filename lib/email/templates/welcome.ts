export function buildWelcomeEmail() {
  const subject = "Welcome to MONTÈ";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="color-scheme" content="dark" />
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#050505;color:#f5f0e8;font-family:Georgia,serif;-webkit-font-smoothing:antialiased;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#050505;">
<tr>
<td align="center" style="padding:40px 20px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;">

<!-- Top gold line -->
<tr>
<td align="center" style="padding:0 0 32px;">
<div style="width:60px;height:1px;background-color:#c9a84c;"></div>
</td>
</tr>

<!-- Brand name -->
<tr>
<td align="center" style="padding:0 0 32px;">
<span style="font-size:28px;letter-spacing:0.25em;color:#c9a84c;font-family:Georgia,'Times New Roman',serif;font-weight:400;">MONTÈ</span>
</td>
</tr>

<!-- Divider -->
<tr>
<td align="center" style="padding:0 0 40px;">
<div style="width:60px;height:1px;background-color:rgba(255,255,255,0.08);"></div>
</td>
</tr>

<!-- Heading -->
<tr>
<td align="center" style="padding:0 0 24px;">
<h1 style="margin:0;font-size:22px;font-weight:400;color:#ffffff;font-family:Georgia,'Times New Roman',serif;letter-spacing:0.05em;">Welcome to the List.</h1>
</td>
</tr>

<!-- Body text -->
<tr>
<td style="padding:0 0 28px;">
<p style="margin:0;font-size:15px;line-height:1.8;color:#f5f0e8;font-family:-apple-system,Helvetica,Arial,sans-serif;">You’ve secured your place. When Collection 001 drops, you’ll be the first to know.</p>
</td>
</tr>

<!-- Perks -->
<tr>
<td style="padding:0 0 32px;">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%">
<tr>
<td style="padding:8px 0;font-size:14px;line-height:1.6;color:#f5f0e8;font-family:-apple-system,Helvetica,Arial,sans-serif;">
<span style="color:#c9a84c;margin-right:10px;">✧</span> First access to Collection 001
</td>
</tr>
<tr>
<td style="padding:8px 0;font-size:14px;line-height:1.6;color:#f5f0e8;font-family:-apple-system,Helvetica,Arial,sans-serif;">
<span style="color:#c9a84c;margin-right:10px;">✧</span> Exclusive event invitations
</td>
</tr>
<tr>
<td style="padding:8px 0;font-size:14px;line-height:1.6;color:#f5f0e8;font-family:-apple-system,Helvetica,Arial,sans-serif;">
<span style="color:#c9a84c;margin-right:10px;">✧</span> Early drops &amp; limited releases
</td>
</tr>
</table>
</td>
</tr>

<!-- Divider -->
<tr>
<td align="center" style="padding:0 0 32px;">
<div style="width:60px;height:1px;background-color:rgba(255,255,255,0.08);"></div>
</td>
</tr>

<!-- Date -->
<tr>
<td align="center" style="padding:0 0 40px;">
<span style="font-size:13px;letter-spacing:0.2em;color:#c9a84c;font-family:monospace;text-transform:uppercase;">July 22, 2026</span>
</td>
</tr>

<!-- CTA link -->
<tr>
<td align="center" style="padding:0 0 40px;">
<a href="https://montedeluxe.com" style="display:inline-block;padding:12px 32px;border:1px solid #c9a84c;color:#c9a84c;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;font-family:-apple-system,Helvetica,Arial,sans-serif;">Visit Montè</a>
</td>
</tr>

<!-- Bottom divider -->
<tr>
<td align="center" style="padding:0 0 24px;">
<div style="width:40px;height:1px;background-color:rgba(255,255,255,0.06);"></div>
</td>
</tr>

<!-- Social -->
<tr>
<td align="center" style="padding:0 0 16px;">
<a href="https://www.instagram.com/houseofmonte/" style="color:#8a8a8a;font-size:12px;text-decoration:none;letter-spacing:0.15em;font-family:-apple-system,Helvetica,Arial,sans-serif;">INSTAGRAM</a>
<span style="color:#5a5a5a;margin:0 12px;">·</span>
<a href="https://www.tiktok.com/@houseofmonte1" style="color:#8a8a8a;font-size:12px;text-decoration:none;letter-spacing:0.15em;font-family:-apple-system,Helvetica,Arial,sans-serif;">TIKTOK</a>
</td>
</tr>

<!-- Footer -->
<tr>
<td align="center" style="padding:0 0 8px;">
<span style="font-size:11px;color:#5a5a5a;letter-spacing:0.1em;font-family:-apple-system,Helvetica,Arial,sans-serif;">Port Harcourt · Rivers State · Nigeria</span>
</td>
</tr>

<tr>
<td align="center">
<span style="font-size:10px;color:#5a5a5a;font-family:-apple-system,Helvetica,Arial,sans-serif;">© MONTÈ 2026</span>
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>`;

  const text = `MONTÈ
—

Welcome to the List.

You've secured your place. When Collection 001 drops, you'll be the first to know.

✧ First access to Collection 001
✧ Exclusive event invitations
✧ Early drops & limited releases

The doors open July 22, 2026.

montedeluxe.com
Port Harcourt · Rivers State · Nigeria
© MONTÈ 2026`;

  return { subject, html, text };
}
