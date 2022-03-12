import type { NextPage } from 'next'
import Head from 'next/head'

import { Container, Center, Box } from '@chakra-ui/react'

const Trigen: NextPage = () => {
	return (
		<>
			<Head>
				<title>Trigen</title>
			</Head>

			<Container maxW="container.lg">
				<Center minH="100vh" py="4">
					<Box borderWidth="1px" borderRadius="lg" overflow="hidden" p="8" background="white">
						This is a trigen.
					</Box>
				</Center>
			</Container>
		</>
	)
}

export default Trigen
