import { STATE_ZONE } from "../data/state-zone.map.js"
import { allLocations, portLocations } from "../interface/locations.interface.js"
import { Port } from "../interface/zone.interface.js"

function pickDefaultPort(state: string): Port {
  const s = state.trim().toUpperCase()

  if (
    s === "WA" || s === "OR" || s === "CA" || s === "NV" ||
    s === "UT" || s === "AZ" || s === "ID" || s === "MT" ||
    s === "WY" || s === "NM"
  )
    return { city: "Los Angeles", state: "CA" }

  if (
    s === "TX" || s === "OK" || s === "KS" || s === "NE" ||
    s === "SD" || s === "CO" || s === "AR" || s === "MO"
  )
    return { city: "Houston", state: "TX" }

  if (s === "FL") return { city: "Jacksonville", state: "FL" }

  if (s === "GA" || s === "SC" || s === "NC")
    return { city: "Savannah", state: "GA" }

  if (s === "MD" || s === "DC")
    return { city: "Baltimore", state: "MD" }

  if (s === "DE")
    return { city: "Wilmington", state: "DE" }

  if (s === "NY" || s === "NJ" || s === "PA")
    return { city: "New York", state: "NY" }

  if (
    s === "CT" || s === "RI" || s === "MA" ||
    s === "VT" || s === "NH" || s === "ME"
  )
    return { city: "Providence", state: "RI" }

  return { city: "Houston", state: "TX" }
}


export function milesBetween(
  locationLat: number,
  locationLong: number,
  portLat: number,
  portLong: number
) {
  const R = 3958.8
  const toRad = (v: number) => (v * Math.PI) / 180

  const dLat = toRad(locationLat - portLat)
  const dLon = toRad(locationLong - portLong)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(locationLat)) *
      Math.cos(toRad(portLat)) *
      Math.sin(dLon / 2) ** 2

  return 2 * R * Math.asin(Math.sqrt(a))
}

function findLatLongLocation( city: string,state: string){
  const c = city.trim().toLowerCase();
  const s = state.trim().toUpperCase();

  const loc = allLocations.find(
    (l) => l.state === s && l.city.toLowerCase() === c
  )
  if (!loc) return undefined;

  return {lat: loc.lat, long: loc.lng}
}



function findPortLatLng(city: string, state: string) {
  const c = city.trim().toLowerCase()
  const s = state.trim().toUpperCase()

  const p = portLocations.find(
    (pl) => pl.state === s && pl.city.trim().toLowerCase() === c
  )
  if (!p) return undefined;

  return { lat: p.lat, lng: p.lng }
}


export function estimateInlandTowing(input: {
  fromState: string
  fromCity: string
}) {
  const fromState = input.fromState.trim().toUpperCase()
  const fromCity = input.fromCity.trim()
  
    const port_min = 320;

  const zone = STATE_ZONE[fromState]
  if (!zone) return "Undefined"

  const toPort = pickDefaultPort(fromState)

  const fromLocation = findLatLongLocation(fromCity, fromState)
  if (!fromLocation) return "Undefined"

  const toPortLocation = findPortLatLng(toPort.city, toPort.state)
  if (!toPortLocation) return "Undefined"

  const departure = `${fromCity}, ${fromState}`

  const rawMiles = milesBetween(
    fromLocation.lat,
    fromLocation.long,
    toPortLocation.lat,
    toPortLocation.lng
  )

  const miles = Math.round(rawMiles / 10) * 10

  let multiplier = 0.61

  if(miles >= 500){
    multiplier = 0.48
  }

  const shippingTotal =
    Math.round((port_min + miles * multiplier) / 10) * 10

  return {
    departure,
    toPort,
    towingTotal: shippingTotal,
  }
}
