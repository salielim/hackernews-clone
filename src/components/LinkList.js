import React, { Component } from 'react'
import { graphql, gql } from 'react-apollo'
import Link from './Link'


class LinkList extends Component {
  _updateCacheAfterVote = (store, createVote, linkId) => {

    // read current state of cached data
    const data = store.readQuery({ query: ALL_LINKS_QUERY })

    // retrieve link that user just voted & reset votes
    const votedLink = data.allLinks.find(link => link.id === linkId)
    votedLink.votes = createVote.link.votes
    
    // write the modified data into store
    store.writeQuery({ query: ALL_LINKS_QUERY, data })
  }
  
  render() {

    if (this.props.allLinksQuery && this.props.allLinksQuery.loading) {
      return <div>Loading</div>
    }
  
    if (this.props.allLinksQuery && this.props.allLinksQuery.error) {
      return <div>Error</div>
    }
  
    const linksToRender = this.props.allLinksQuery.allLinks

    return (
      <div>
        {linksToRender.map((link, index) => (
          <Link key={link.id} updateStoreAfterVote={this._updateCacheAfterVote}  index={index} link={link}/>
        ))}
      </div>
    )
  }

}

export const ALL_LINKS_QUERY = gql`
query AllLinksQuery {
  allLinks {
    id
    createdAt
    url
    description
    postedBy {
      id
      name
    }
    votes {
      id
      user {
        id
      }
    }
  }
}
`

export default graphql(ALL_LINKS_QUERY, { name: 'allLinksQuery' }) (LinkList)
// name: is the name of the prop, if not specified it would be called data