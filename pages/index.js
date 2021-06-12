import React, { useEffect, useState, useCallback } from 'react'
import Router from 'next/router'
import { magic } from '../magic'
import Loading from '../components/loading'

export default function Index() {
	const [userMetadata, setUserMetadata] = useState()
	const [didToken, setDidToken] = useState()

	useEffect(() => {
		// On mount, we check if a user is logged in.
		// If so, we'll retrieve the authenticated user's profile.
		magic.user.isLoggedIn().then((magicIsLoggedIn) => {
			if (magicIsLoggedIn) {
				magic.user.getMetadata().then(setUserMetadata)
				magic.user.getIdToken({ lifespan: 60 * 60 * 10 }).then(setDidToken)
			} else {
				// If no user is logged in, redirect to `/login`
				Router.push('/login')
			}
		})
	}, [])

	/**
	 * Perform logout action via Magic.
	 */
	const logout = useCallback(() => {
		magic.user.logout().then(() => {
			Router.push('/login')
		})
	}, [Router])

	return userMetadata && didToken ? (
		<div className="container">
			<h1>Current user: {userMetadata.email}</h1>
			<strong>✨DID Token✨</strong>
			<pre>{didToken}</pre>
			<p>
				Validity of this DID Token is <strong>10 hours.</strong> Read{' '}
				<a
					href="https://docs.magic.link/client-sdk/web/api-reference#getidtoken"
					target="_blank"
				>
					here{' '}
				</a>{' '}
				to extend more.
			</p>
			<button onClick={logout}>Logout</button>
		</div>
	) : (
		<Loading />
	)
}
