import { TrigenInputDataType } from 'types/TrigenInputDataType'

import { Heading, Box, VStack } from '@chakra-ui/react'

import FormField from 'components/FormField'
import FormActionButton from 'components/FromActionButton'
import { Formik, Form } from 'formik'

const INITIAL_VAL: Partial<TrigenInputDataType> = {
	max_steam_volume: 0,
	max_steam_pressure: 0,
	prod_steam_volume: 0,
	prod_steam_pressure: 0,
	prod_steam_temp: 0,
	input_steam_temp: 0,
	input_steam_pressure: 0,
	boiler_efficiency: 0,
}

const Section2 = ({
	updateFormValue,
	nextStep,
	prevStep,
}: {
	updateFormValue: (_: Partial<TrigenInputDataType>) => void
	nextStep?: () => void
	prevStep?: () => void
}) => {
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
