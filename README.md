# photo-gallery-webclient

This project is a simple web site to share and comment photos organized
in albums. It is a web interface for the
[photo-gallery-api](https://github.com/Pamoi/photo-gallery-api) REST API,
although it can easily be extended to support other content sources by
modifying the factories in `app/factories`.

It is built in Javascript using [AngularJS](https://angularjs.org/) and
[Bootstrap](getbootstrap.com/). A live demo is available
[here](https://demo.mgirod.ch).

## Installation

To install the web client you have to clone this repository and install
the dependencies using [npm](https://www.npmjs.com/):

```bash
git clone https://github.com/Pamoi/photo-gallery-webclient.git
cd photo-gallery-webclient
npm install
```

You then have to set the remote API's URL in `app/config.js.dist` and
save it as `config.js`.

Finally serve the `app/` folder with your favorite web server.
