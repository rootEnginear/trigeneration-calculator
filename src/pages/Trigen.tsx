import type { NextPage } from 'next'
import { useState } from 'react'
import Head from 'next/head'

import {
	Container,
	Center,
	Box,
	Heading,
	// Text,
	Button,
	Flex,
	Spacer,
	Input,
	VStack,
	FormControl,
	FormLabel,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import Stepper from 'react-stepper-horizontal'

const StepperWrapper = styled.div`
	div > div > div > div > a,
	div > div > div > div > span {
		line-height: 30px !important;
	}
`

const Trigen: NextPage = () => {
	const TRIGEN_STEPS = [
		{ title: 'ข้อมูลทั่วไป' },
		{ title: 'Boiler' },
		{ title: 'Turbine' },
		{ title: 'Chiller' },
		{ title: 'Economic Analysis' },
	]

	const [step, setStep] = useState(0)

	const nextStep = () => setStep((_) => (++_ >= TRIGEN_STEPS.length ? --_ : _))
	const prevStep = () => setStep((_) => (--_ < 0 ? ++_ : _))

	const [value, setValue] = useState('')
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value)

	return (
		<>
			<Head>
				<title>Trigen</title>
			</Head>

			<Container maxW="container.lg">
				<Center minH="100vh" py="4">
					<Box borderWidth="1px" borderRadius="lg" overflow="hidden" p="8" background="white">
						<StepperWrapper>
							<Stepper steps={TRIGEN_STEPS} activeStep={step} />
						</StepperWrapper>
						<Box mt={8}></Box>

						<Heading as="h1" size="2xl" w="full">
							ข้อมูลทั่วไป
						</Heading>
						<Box mt={4}></Box>
						<VStack textAlign="left">
							<FormControl isRequired>
								<FormLabel htmlFor="test">Email address</FormLabel>
								<Input
									id="test"
									value={value}
									onChange={handleChange}
									placeholder="Here is a sample placeholder"
								/>
							</FormControl>
						</VStack>

						<Box mt={8}></Box>
						<Flex>
							{step !== 0 && <Button onClick={prevStep}>«</Button>}
							<Spacer />
							{step !== TRIGEN_STEPS.length - 1 && <Button onClick={nextStep}>»</Button>}
						</Flex>
					</Box>
				</Center>
			</Container>
		</>
	)
}

export default Trigen
