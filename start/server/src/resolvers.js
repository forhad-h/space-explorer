const { paginateResults } = require('./utils')

module.exports = {
  Query: {
    launches: async (_, { pageSize = 20, after }, { dataSources }) => {
      const allLaunches = await dataSources.launchAPI.getAllLaunches()
      allLaunches.reverse()
      const launches = paginateResults({
        after,
        pageSize,
        results: allLaunches
      })
      return {
        launches,
        cursor: launches.length ? launches[launches.length - 1].cursor : null,
        hasMore: launches.length
          ? launches[launches.length - 1].cursor !=
            allLaunches[allLaunches.length - 1].cursor
          : false
      }
    },
    launch: async (_, { id }, { dataSources }) => {
      return await dataSources.launchAPI.getLaunchById({ launchId: id })
    },
    me: async (_, __, { dataSources }) =>
      await dataSources.userAPI.findOrCreateUser()
  },
  Mutation: {
    bookTrips: async (_, { launchIds }, { dataSources }) => {
      const results = await dataSources.userAPI.bookTrips({ launchIds })
      const launches = await dataSources.launchAPI.getLaunchesByIds({
        launchIds
      })

      return {
        success: results && results.length === launches.length,
        message:
          results.length === launches.length
            ? 'Trips booked successfully'
            : `The following launches couldn't be booked ${launchIds.filter(
              id => !results.include(id)
            )}`,
        launches
      }
    },
    cancelTrip: async (_, { launchId }, { dataSources }) => {
      const result = await dataSources.userAPI.cancelTrip({ launchId })
      if (!result) {
        return {
          success: false,
          message: 'Failed to cancel trip'
        }
      }

      const launch = await dataSources.launchAPI.getLaunchById({ launchId })
      return {
        success: true,
        message: 'Trip cancelled',
        launches: [launch]
      }
    },
    login: async (_, { email }, { dataSources }) => {
      const user = await dataSources.userAPI.findOrCreateUser({ email })
      if (user) return Buffer.from(email).toString('base64')
    }
  },
  Mission: {
    missionPatch: (mission, { size } = { size: 'LARGE' }) => {
      return size === 'SMALL'
        ? mission.missionPatchSmall
        : mission.missionPatchLarge
    }
  },
  Launch: {
    isBooked: async (launch, _, { dataSources }) =>
      await dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id })
  },
  User: {
    trips: async (_, __, { dataSources }) => {
      const launchIds = await dataSources.userAPI.getLaunchIdByUser()
      if (!launchIds.length) return []
      return (await dataSources.launchAPI.getLaunchesByIds({ launchIds })) || []
    }
  }
}
