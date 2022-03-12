import type { NextPage } from 'next'
import Head from 'next/head'

import { Container, Center, Box } from '@chakra-ui/react'

const Template: NextPage = () => {
	return (
		<>
			<Head>
				<title>Template</title>
			</Head>

			<Container maxW="container.lg">
				<Center h="100vh">
					<Box borderWidth="1px" borderRadius="lg" overflow="hidden" p="8" background="white">
						This is a template.
					</Box>
				</Center>
			</Container>
		</>
	)
}

export default Template
