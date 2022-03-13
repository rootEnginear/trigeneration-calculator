import { TrigenInputDataType } from 'types/TrigenInputDataType'

import { Heading, Box, Button, Flex, Spacer, VStack, Stack } from '@chakra-ui/react'

import FormInput from 'components/FormInput'
import { Formik, Field, Form } from 'formik'

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
										<FormInput
											inputId="hr_per_day"
											label="ชั่วโมงการทำงานต่อวัน"
											placeholder="ชั่วโมงทำงาน (ชั่วโมง/วัน)"
											addonText="ชั่วโมง/วัน"
											inputProps={field}
										/>
									)}
								</Field>
								<Field name="day_per_year">
									{({ field }: any) => (
										<FormInput
											inputId="day_per_year"
											label="วันทำงานต่อปี"
											placeholder="วันทำงานต่อปี (วัน/ปี)"
											addonText="วัน/ปี"
											inputProps={field}
										/>
									)}
								</Field>
							</Stack>
							<Field name="electrical_cost">
								{({ field }: any) => (
									<FormInput
										inputId="electrical_cost"
										label="ค่าไฟ"
										placeholder="ค่าไฟ (บาท/ยูนิต)"
										addonText="บาท/ยูนิต"
										inputProps={field}
									/>
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
		</>
	)
}

export default Section1
