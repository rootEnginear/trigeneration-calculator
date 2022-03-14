import { TrigenInputDataType } from 'types/trigenTypes'

import type { NextPage } from 'next'
import { useState } from 'react'
import Head from 'next/head'

import { Container, Center, Box, Text } from '@chakra-ui/react'

import styled from '@emotion/styled'
import Stepper from 'react-stepper-horizontal'
const StepperWrapper = styled.div`
	div > div > div > div > a,
	div > div > div > div > span {
		line-height: 30px !important;
	}
`

import Section1 from './subpages/section1'
import Section2 from './subpages/section2'

const Trigen: NextPage = () => {
	const TRIGEN_STEPS = [
		{ title: 'ข้อมูลทั่วไป' },
		{ title: 'Boiler' },
		{ title: 'Turbine' },
		{ title: 'Absorption Chiller' },
		{ title: 'Economical Analysis' },
	]

	const [step, setStep] = useState(0)

	const nextStep = () => setStep((_) => (++_ >= TRIGEN_STEPS.length ? --_ : _))
	const prevStep = () => setStep((_) => (--_ < 0 ? ++_ : _))

	const [formValue, setFormValue] = useState<TrigenInputDataType>({
		hr_per_day: 24,
		day_per_year: 330,
		electrical_cost: 3.7,

		max_steam_volume: 20,
		max_steam_pressure: 25,

		prod_steam_volume: 16,
		prod_steam_pressure: 22.5,
		prod_steam_temp: 226,

		input_steam_temp: 107,
		input_steam_pressure: 0.3,

		boiler_efficiency: 90.74,

		fuel_type: 'ไม้สับ',

		isentropic_efficiency: 53,
		generator_efficiency: 95,

		outlet_pressure: 12.5,

		required_steam_flow_rate: 5,
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

						<Text fontSize="xs">{JSON.stringify(formValue)}</Text>

						{step === 0 && <Section1 {...{ nextStep, formValue, updateFormValue }} />}
						{step === 1 && <Section2 {...{ prevStep, nextStep, formValue, updateFormValue }} />}
					</Box>
				</Center>
			</Container>
		</>
	)
}

export default Trigen
