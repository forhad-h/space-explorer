import React, { Fragment } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { LAUNCH_TILE_DATA } from '../gql_fragments'
import { Loading, LaunchTile } from '../components'

export const GET_LAUNCH = gql`
  query GetLaunch($launchId: ID!) {
    launch(id: $launchId) {
      ...LaunchTile
    }
  }
  ${LAUNCH_TILE_DATA}
`
export default function CartItem ({ launchId }) {
  return (
    <Query query={GET_LAUNCH} variables={{ launchId }}>
      {({ data, loading, error }) => {
        if (loading) return <Loading />
        if (error) return <p>ERROR: {error.message}</p>
        return (
          <Fragment>
            <LaunchTile launch={data.launch} />
          </Fragment>
        )
      }}
    </Query>
  )
}
