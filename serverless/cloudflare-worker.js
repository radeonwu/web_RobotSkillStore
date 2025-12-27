export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ ok:false, error:"Method not allowed" }), {
        status: 405,
        headers: { "content-type": "application/json" }
      });
    }
    let body={};
    try {
      body = await request.json();
    } catch (e) {
      return new Response(JSON.stringify({ ok:false, error:"Invalid JSON" }), {
        status: 400,
        headers: { "content-type": "application/json" }
      });
    }

    const to = body.to || "towu.xiaojun@gmail.com";
    const fromName = body.from_name || "RobotSkillStore Visitor";
    const fromEmail = body.from_email || "noreply@robotskillstore.ai";
    const message = body.message || "";
    const page = body.page || "";

    const subject = `[RobotSkillStore] New message from ${fromName}`;
    const content = `From: ${fromName} <${fromEmail}>\nPage: ${page}\n\n${message}`;

    // Cloudflare Workers can send via MailChannels
    // Docs: https://developers.cloudflare.com/workers/tutorials/send-emails-with-mailchannels/
    const mail = {
      personalizations: [{ to: [{ email: to }] }],
      from: { email: "noreply@robotskillstore.ai", name: "RobotSkillStore" },
      reply_to: { email: fromEmail, name: fromName },
      subject,
      content: [{ type: "text/plain", value: content }],
    };

    const resp = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(mail),
    });

    const ok = resp.ok;
    const text = await resp.text().catch(() => "");
    return new Response(JSON.stringify({ ok, status: resp.status, detail: text.slice(0, 600) }), {
      status: ok ? 200 : 502,
      headers: { "content-type": "application/json" }
    });
  }
};