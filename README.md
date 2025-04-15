# ISS Tracker

Tracks the ISS. Shows nearest city. Lets user select a city and see if the ISS will be overhead in the next 12 hours, and if so, when.

This is very much a first version, with a lot missing.

Things to consider:

- ~~Redo using TS - useful for the APIs~~
- ~~Update to Vite~~
- Remove console logging (!)
- ~~Remove dead code~~
- Consider how to make API calls more consistent
- ~~More loading handling - hook into leaflet API eg~~
- Tests
- SWR approaches
- Add line tracking for history - toggable
- Add live site to github pages and add actions
- Add extra map when choosing future viewing and jump to location

To use:

Add an env file, eg

```
VITE_COUNTRIES_SERVICE_URL=http://localhost:8000/countries
VITE_ISS_CURRENT_URL=http://api.open-notify.org/iss-now.json
VITE_ISS_PASSES_URL=https://api.g7vrd.co.uk/v1/satellite-passes/25544/%lat%/%lon%.json?hours=12

```

`npm i`

`npm run json`

`npm run start`

> One little point, React's strict dev mode (mount, dismount, mount) will redo API calls, this will get the second blocked from some endpoints. Therefore the abort signals in the APIs are extra important