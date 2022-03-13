import { TrigenInputDataType } from 'types/trigenTypes'

import { Heading, Box, VStack, Stack } from '@chakra-ui/react'

import FormField from 'components/FormField'
import FormActionButton from 'components/FromActionButton'
import { Formik, Form } from 'formik'

import { FieldDataKey } from 'data/fieldData'
const SELECTED_KEYS: FieldDataKey[] = ['hr_per_day', 'day_per_year', 'electrical_cost']

const Section1 = ({
	formValue,
	updateFormValue,
	nextStep,
}: {
	formValue: TrigenInputDataType
	updateFormValue: (_: Partial<TrigenInputDataType>) => void
	nextStep: () => void
}) => {
	const INITIAL_VAL = SELECTED_KEYS.reduce(
		(all, current) => ({ ...all, [current]: formValue[current] }),
		{}
	)

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
