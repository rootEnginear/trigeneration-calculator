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
	Stack,
	FormControl,
	FormLabel,
	InputGroup,
	InputRightAddon,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import Stepper from 'react-stepper-horizontal'
import { Formik, Field, Form } from 'formik'

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
		{ title: 'Economical Analysis' },
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
					<Box
						borderWidth="1px"
						borderRadius="lg"
						overflow="hidden"
						p="8"
						background="white"
						flex="1 1 0%">
						<StepperWrapper>
							<Stepper steps={TRIGEN_STEPS} activeStep={step} />
						</StepperWrapper>
						<Box mt={8}></Box>

						<Heading as="h1" size="2xl" w="full">
							ข้อมูลทั่วไป
						</Heading>
						<Box mt={4}></Box>

						<Formik
							initialValues={{ hr_per_day: 24, day_per_year: 330, electrical_cost: 3.7 }}
							onSubmit={(values, actions) => {
								setTimeout(() => {
									alert(JSON.stringify(values, null, 2))
									actions.setSubmitting(false)
								}, 1000)
							}}>
							{() => (
								<Form>
									<VStack>
										<Stack direction={['column', 'row']} spacing="4" w="full">
											<Field name="hr_per_day">
												{({ field }: any) => (
													<FormControl isRequired>
														<FormLabel htmlFor="hr_per_day">ชั่วโมงการทำงานต่อวัน</FormLabel>
														<InputGroup>
															<Input
																{...field}
																id="hr_per_day"
																placeholder="ชั่วโมงทำงาน (ชั่วโมง/วัน)"
															/>
															<InputRightAddon>ชั่วโมง/วัน</InputRightAddon>
														</InputGroup>
													</FormControl>
												)}
											</Field>
											<Field name="day_per_year">
												{({ field }: any) => (
													<FormControl isRequired w="full">
														<FormLabel htmlFor="day_per_year">วันทำงานต่อปี</FormLabel>
														<InputGroup>
															<Input
																{...field}
																id="day_per_year"
																placeholder="วันทำงานต่อปี (วัน/ปี)"
															/>
															<InputRightAddon>วัน/ปี</InputRightAddon>
														</InputGroup>
													</FormControl>
												)}
											</Field>
										</Stack>
										<Field name="electrical_cost">
											{({ field }: any) => (
												<FormControl isRequired>
													<FormLabel htmlFor="hrperday">ค่าไฟ</FormLabel>
													<InputGroup>
														<Input {...field} id="hrperday" placeholder="ค่าไฟ (บาท/ยูนิต)" />
														<InputRightAddon>บาท/ยูนิต</InputRightAddon>
													</InputGroup>
												</FormControl>
											)}
										</Field>
									</VStack>
								</Form>
							)}
						</Formik>

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
