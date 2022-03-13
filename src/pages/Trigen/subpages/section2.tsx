import { TrigenInputDataType } from 'types/TrigenInputDataType'

import { Heading, Box, VStack } from '@chakra-ui/react'

import FormField from 'components/FormField'
import FormActionButton from 'components/FromActionButton'
import { Formik, Form } from 'formik'

const SELECTED_KEYS = [
	'max_steam_volume',
	'max_steam_pressure',
	'prod_steam_volume',
	'prod_steam_pressure',
	'prod_steam_temp',
	'input_steam_temp',
	'input_steam_pressure',
	'boiler_efficiency',
]

const Section2 = ({
	formValue,
	updateFormValue,
	nextStep,
	prevStep,
}: {
	formValue: TrigenInputDataType
	updateFormValue: (_: Partial<TrigenInputDataType>) => void
	nextStep?: () => void
	prevStep?: () => void
}) => {
	const INITIAL_VAL = SELECTED_KEYS.reduce(
		(all, current) => ({ ...all, [current]: formValue[current] }),
		{}
	)

	return (
		<>
			<Heading as="h1" size="2xl" w="full">
				Boiler
			</Heading>
			<Box mt={4}></Box>
			<Formik
				initialValues={INITIAL_VAL}
				onSubmit={(values: Partial<TrigenInputDataType>) => {
					updateFormValue(values)
				}}>
				{({ submitForm }) => (
					<Form>
						<VStack>
							{Object.keys(INITIAL_VAL).map((key) => (
								<FormField name={key} key={key} />
							))}
						</VStack>
						<FormActionButton submitForm={submitForm} nextStep={nextStep} prevStep={prevStep} />
					</Form>
				)}
			</Formik>
		</>
	)
}

export default Section2
