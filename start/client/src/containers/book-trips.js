import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import Button from '../components/button'
import { GET_LAUNCH } from './cart-item'

const BOOK_TRIPS = gql`
  mutation BookTrips($launchIds: [ID!]!) {
    bookTrips(launchIds: $launchIds) {
      success
      message
      launches {
        id
        isBooked
      }
    }
  }
`

export default function BookTrips ({ cartItems }) {
  return (
    <Mutation
      mutation={BOOK_TRIPS}
      variables={{ launchIds: cartItems }}
      refetchQueries={cartItems.map(launchId => {
        return {
          query: GET_LAUNCH,
          variables: { launchId }
        }
      })}
      update={cache => {
        cache.writeData({ data: { cartItems: [] } })
      }}
    >
      {(bookTrips, { data, loading, error }) => {
        if (loading) return <p>Loading...</p>
        if (error) return <p>ERROR: {error.message}</p>
        return data && data.bookTrips && !data.bookTrips.success ? (
          <p data-testid='message'>{data.bookTrips.message}</p>
        ) : (
          <Button onClick={bookTrips} data-testid='book-button'>
            Book All
          </Button>
        )
      }}
    </Mutation>
  )
}
