# ISS Tracker

Tracks the ISS. Shows nearest city. Lets user select a city and see if the ISS will be overhead in the next 12 hours, and if so, when.

This is very much a first version, with a lot missing.

Things to consider:

- [x] Redo using TS - useful for the APIs
- [x] Update to Vite~~
- [ ] Remove console logging (!)
- [x] Remove dead code
- [x] Consider how to make API calls more consistent
- [x] More loading handling - hook into leaflet API eg, turn off polling when page not active
- [ ] Tests
- [ ] SWR approaches
- [ ] Add line tracking for history - toggable
- [x] Add live site to github pages and add actions
- [ ] Add extra map when choosing future viewing and jump to location
- [x] Change telemetry display to be grid with hover effect
- [ ] Make telemetry display look cooler
- [ ] Add a number spinner/changer for the numbers
- [ ] Similar for the text, typist like feature
- [ ] Tidy up code

`npm i`

`npm run start`

> One little point, React's strict dev mode (mount, dismount, mount) will redo API calls, this will get the second blocked from some endpoints. Therefore the abort signals in the APIs are extra important