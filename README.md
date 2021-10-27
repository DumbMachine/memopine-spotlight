# Memopine

Memopine was a spotlight-like search interface that provided search results from authenticated services like google suite, zoom. A search-engine that furnishes results from _your_ knowledge silos across third party services.

This repository is just a public mirror with **some** code from the `Electron App` and does not contain all the parts required to run this demo. If you are looking for soemthing that achieves what _Memopine_ wished to achieve have a look at [Raycast](raycast.com/).

# Demos

<details>
    <summary>1. Connecting Third Party Services</summary>
    <p>
     <p>Upon successful authentication, all access information is stored locally with a sqlite instance, i.e. no credentials are stored by the auth provider. Access Tokens are refreshed automagically in the background.</p>
     <p>All requests for indexing/searching data make use of credentials stored locally, making for secure access to services.
     </p>
    </p>
    <img src="readme_assets/zoomauth_showcase.gif" />
    </p>
</details>
<br>
<details>
    <summary>1. Opening a Figma Node</summary>
    <p>
    <img src="readme_assets/figma_showcase.gif" />
    </p>
</details>

<br>

<details>
    <summary>2. Opening a meeting in Zoom</summary>
    <p>
    <h1>Connecting supported third party services is as simple as</h1>
    <img src="readme_assets/zoom_showcase.gif" />
    </p>
</details>

<br>
<details>
    <summary>3. Directly lookup your mail/calendar</summary>
    <p>
    Background process keep track of your upcoming meetings, notify with quicklink to join them.
    </p>
    Mail:
    <img src="readme_assets/mail_showcase.gif" />
    Calendar:
    <img src="readme_assets/gproducts_showcase.gif" />
    </p>
</details>
<br>

<details>
    <summary>5. Get notified for your meetings</summary>
    <p>
    Background process keep track of your upcoming meetings, notify with quicklink to join them.
    </p>
    <img src="readme_assets/topbar_showcase.gif" />
    </p>
</details>
