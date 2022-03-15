import { TrigenInputDataType } from 'types/trigenTypes'

import { Heading, VStack, Stack } from '@chakra-ui/react'

import FormField from 'components/FormField'
import FormActionButton from 'components/FromActionButton'
import { useForm } from 'react-hook-form'

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

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<TrigenInputDataType>({
		defaultValues: INITIAL_VAL,
	})

	const saveData = (values: Partial<TrigenInputDataType>) => {
		updateFormValue(values)
	}

	return (
		<>
			<Heading as="h1" size="2xl" w="full" mb={4}>
				ข้อมูลทั่วไป
			</Heading>
			<form>
				<VStack>
					<Stack direction={['column', 'row']} spacing="4" w="full">
						<FormField name="hr_per_day" {...{ register, errors }} />
						<FormField name="day_per_year" {...{ register, errors }} />
					</Stack>
					<FormField name="electrical_cost" {...{ register, errors }} />
				</VStack>
				<FormActionButton submitForm={handleSubmit(saveData)} nextStep={nextStep} />
			</form>
		</>
	)
}

export default Section1
