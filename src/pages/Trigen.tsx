import type { NextPage } from 'next'
import { useState } from 'react'
import Head from 'next/head'

import {
	Container,
	Center,
	Box,
	Heading,
	Text,
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
const StepperWrapper = styled.div`
	div > div > div > div > a,
	div > div > div > div > span {
		line-height: 30px !important;
	}
`

import { Formik, Field, Form } from 'formik'
import { TrigenInputDataType } from 'types/TrigenInputDataType'

const Section1 = ({
	updateFormValue,
	nextStep,
}: {
	updateFormValue: (_: Partial<TrigenInputDataType>) => void
	nextStep: () => void
}) => {
	return (
		<Formik
			initialValues={
				{
					hr_per_day: 0,
					day_per_year: 0,
					electrical_cost: 0,
				} as Partial<TrigenInputDataType>
			}
			onSubmit={(values: Partial<TrigenInputDataType>) => {
				updateFormValue(values)
				nextStep()
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
											<Input {...field} id="hr_per_day" placeholder="ชั่วโมงทำงาน (ชั่วโมง/วัน)" />
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
											<Input {...field} id="day_per_year" placeholder="วันทำงานต่อปี (วัน/ปี)" />
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
					<Box mt={8}></Box>
					<Flex>
						<Spacer />
						<Button type="submit">»</Button>
					</Flex>
				</Form>
			)}
		</Formik>
	)
}

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

	const [formValue, setFormValue] = useState<TrigenInputDataType>({
		hr_per_day: 0,
		day_per_year: 0,
		electrical_cost: 0,

		max_steam_volume: 0,
		max_steam_pressure: 0,

		prod_steam_volume: 0,
		prod_steam_pressure: 0,
		prod_steam_temp: 0,

		input_steam_temp: 0,
		input_steam_pressure: 0,

		boiler_efficiency: 0,

		fuel_type: 'ไม้สับ',

		isentropic_efficiency: 0,
		generator_efficiency: 0,

		outlet_pressure: 0,

		required_steam_flow_rate: 0,
	})

	const updateFormValue = (newFormValue: Partial<TrigenInputDataType>) =>
		setFormValue((_: TrigenInputDataType) => ({ ..._, ...newFormValue }))

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
						<Text size="sm">{JSON.stringify(formValue)}</Text>
						<Box mt={4}></Box>

						{step === 0 && <Section1 nextStep={nextStep} updateFormValue={updateFormValue} />}

						{/*
						<Box mt={8}></Box>
						<Flex>
							{step !== 0 && <Button onClick={prevStep}>«</Button>}
							<Spacer />
							{step !== TRIGEN_STEPS.length - 1 && <Button onClick={nextStep}>»</Button>}
						</Flex>
						*/}
					</Box>
				</Center>
			</Container>
		</>
	)
}

export default Trigen
