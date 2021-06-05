import React, { Component } from 'react'
import { notification } from 'antd'
import GoogleMapReact from 'google-map-react'
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import Marker from './Marker'
import './GoogleMap.scss'

class GoogleMap extends Component {
  state = {
    lat: '',
    lng: '',
    stateLocation: { lat: 51.165691, lng: 10.451526 },
  }

  componentWillReceiveProps = prevProps => {
    const { street, city, state, latitudeHandler, location, mapSearch } = this.props
    if (prevProps.street !== street || prevProps.city !== city || prevProps.state !== state) {
      const searchVal = `${prevProps.street} ${prevProps.city}`
      if (searchVal) {
        try {
          geocodeByAddress(searchVal)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
              const { lat, lng } = latLng
              latitudeHandler(latLng)
              this.setState({
                stateLocation: latLng,
                lat,
                lng,
              })
            })
            .catch(() => {
              const args = {
                message: 'MAP Message',
                description: 'Invalid Address please Update Your Address',
                duration: 4,
                placement: 'bottomRight',
                bottom: 50,
              }
              notification.error(args)
            })
        } catch (error) {
          const args = {
            message: 'MAP Message',
            description: 'Invalid Address please Update Your Address ',
            duration: 4,
            placement: 'bottomRight',
            bottom: 50,
          }
          notification.error(args)
        }
      }
    }

    if (prevProps.location !== location) {
      if (mapSearch !== undefined) {
        mapSearch()
      }
      const { _lat, _long } = location
      this.setState({ stateLocation: location, lat: _lat, lng: _long })
    }
  }

  onMapClick = ({ lat, lng }) => {
    const payload = {
      lat,
      lng,
    }
    const { latitudeHandler } = this.props
    latitudeHandler({ lat, lng })
    this.setState({ lat, lng, stateLocation: payload })
  }

  render() {
    const { lat, lng, stateLocation } = this.state
    const { location, pins } = this.props
    const { latitude, longitude } = location || {}
    const mixedLocations = {
      lat: lat || latitude,
      lng: lng || longitude,
    }

    const defaultMapOptions = {
      fullscreenControl: false,
    }
    return (
      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.REACT_APP_GOOGLE_MAPS_KEY,
        }}
        options={defaultMapOptions}
        style={{ width: '100%', height: '300px' }}
        // draggable={!signed || !deleted ? false : !signed || !deleted}
        draggable
        // yesIWantToUseGoogleMapApiInternals
        center={
          location
            ? { lat: mixedLocations.lat, lng: mixedLocations.lng }
            : { lat: stateLocation.lat, lng: stateLocation.lng }
        }
        defaultZoom={10}
        resetBoundsOnResize
        onClick={e =>
          pins ? this.onMapClick({ lat: e.lat, lng: e.lng }) : console.log('Record is Locked')
        }
      >
        {lat || (latitude && lng) || longitude ? (
          <Marker
            color="red"
            lat={lat || latitude}
            lng={lng || longitude}
            onDragEnd={e => (pins ? this.onMarkerDragEnd(e.nativeEvent.coordinate) : null)}
          />
        ) : null}
        {/* {outPosition ? <Marker color="blue" lat={outPosition.latitude} lng={outPosition.longitude} /> : null} */}
      </GoogleMapReact>
    )
  }
}
export default GoogleMap
