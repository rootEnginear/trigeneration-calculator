import { TrigenInputDataType } from 'types/TrigenInputDataType'

import { Heading, Box, VStack, Stack } from '@chakra-ui/react'

import FormField from 'components/FormField'
import FormActionButton from 'components/FromActionButton'
import { Formik, Form } from 'formik'

const INITIAL_VAL: Partial<TrigenInputDataType> = {
	hr_per_day: 0,
	day_per_year: 0,
	electrical_cost: 0,
}

const Section1 = ({
	updateFormValue,
	nextStep,
}: {
	updateFormValue: (_: Partial<TrigenInputDataType>) => void
	nextStep: () => void
}) => {
	return (
		<>
			<Heading as="h1" size="2xl" w="full">
				ข้อมูลทั่วไป
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
							<Stack direction={['column', 'row']} spacing="4" w="full">
								<FormField name="hr_per_day" />
								<FormField name="day_per_year" />
							</Stack>
							<FormField name="electrical_cost" />
						</VStack>
						<FormActionButton submitForm={submitForm} nextStep={nextStep} />
					</Form>
				)}
			</Formik>
		</>
	)
}

export default Section1
