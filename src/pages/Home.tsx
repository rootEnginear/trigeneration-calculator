import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { Container, Center, Box, VStack, Heading, Stack, Button } from '@chakra-ui/react'

const Home: NextPage = () => {
	const router = useRouter()

	const gotoTrigen = () => {
		router.push('/trigen')
	}

	const gotoCompare = () => {}

	return (
		<>
			<Head>
				<title>Trigeneration Calculator</title>
			</Head>

			<Container maxW="container.lg">
				<Center minH="100vh" py="4">
					<Box borderWidth="1px" borderRadius="lg" overflow="hidden" p="8" background="white">
						<VStack spacing="8">
							<Heading as="h1" size="2xl" isTruncated w="full" textAlign="center">
								Trigeneration Calculator
							</Heading>
							<Stack direction={['column', 'row']} spacing="4" w="full">
								<Button
									variant="outline"
									flex="1 1 0%"
									height="unset"
									whiteSpace="initial"
									py="4"
									onClick={gotoTrigen}>
									<VStack spacing="4" w="full">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth={2}>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
											/>
										</svg>
										<Heading as="h2" size="md" textAlign="center">
											คำนวณ Trigeneration System
										</Heading>
									</VStack>
								</Button>
								<Button variant="outline" flex="1 1 0%" height="unset" whiteSpace="initial" py="4">
									<VStack spacing="4" w="full">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth={2}>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
											/>
										</svg>
										<Heading as="h2" size="md" textAlign="center">
											เปรียบเทียบ Boiler
										</Heading>
									</VStack>
								</Button>
								{/* <Text>

								</Text>
								<Text>

								</Text> */}
							</Stack>
						</VStack>
					</Box>
				</Center>
			</Container>
		</>
	)
}

export default Home
