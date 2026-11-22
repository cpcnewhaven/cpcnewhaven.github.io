# Newsletter form delivery

The static HTML newsletter forms and `src/js/adult-studies-shell.js` submit
first name, last name, and email to `https://formspree.io/f/xpwaqlwd` using a native HTML POST.
All three fields are required. `src/js/newsletter-form.js` keeps Subscribe disabled
until nonblank first and last names and a valid email are entered. Native browser validation
still applies when JavaScript is unavailable.

## Spam protection

Each signup form includes a hidden `_gotcha` field. Formspree silently ignores
submissions that fill it in. [Formspree honeypot documentation](https://help.formspree.io/articles/building-your-form/honeypot-spam-filtering)

1. Open form `xpwaqlwd` in Formspree. Under **Settings → Spam protection**,
   enable Formspree's hosted CAPTCHA. The existing native POST lets Formspree
   present the challenge after the visitor clicks Subscribe.
   [Formspree CAPTCHA settings](https://help.formspree.io/articles/form-and-project-settings/recaptcha-settings)
2. In the project's settings, set **Restrict to Domain** to `cpcnewhaven.org`
   if all forms in that project are served from that domain or its subdomains.
   This setting relies on the browser sending a referrer.
   [Formspree domain restriction documentation](https://help.formspree.io/articles/form-and-project-settings/restrict-to-domain)
3. After deploying, complete a test signup on the live site and confirm it
   arrives in Formspree and the admin inbox.

## Notification recipient

Email delivery is configured in Formspree, not in a hidden HTML field:

1. In Account, add `admin@cpcnewhaven.org` under Linked Emails if needed,
   and complete verification from that inbox.
2. Open the form whose Integration endpoint is `/f/xpwaqlwd`.
3. In Workflow, open the Email action's Settings (or add an Email action),
   select `admin@cpcnewhaven.org` as the target email, and save.
4. Check any Rules for recipient overrides.
5. After deploying the website, submit a clearly identified test subscription
   and confirm it appears in Submissions and reaches the admin inbox.

These requests notify staff of newsletter signups; mailing-list enrollment
requires staff handling or a mailing-list integration configured in Formspree.

Official instructions:
https://help.formspree.io/articles/form-and-project-settings/changing-a-form-email-address

## Deferred planning

An optional audience dropdown (Member, Regular Attender, Guest, etc.) is
deferred until fall planning. If added, confirm its options and whether it
should be required.
