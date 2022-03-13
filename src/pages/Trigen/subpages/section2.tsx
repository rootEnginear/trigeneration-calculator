import { TrigenInputDataType } from 'types/trigenTypes'

import {
	Heading,
	Box,
	VStack,
	Divider,
	Table,
	Thead,
	Tbody,
	Tfoot,
	Tr,
	Th,
	Td,
	TableCaption,
} from '@chakra-ui/react'

import FormField from 'components/FormField'
import FormActionButton from 'components/FromActionButton'
import { Formik, Form } from 'formik'

import { FieldDataKey, FIELD_DATA } from 'data/fieldData'
const SELECTED_KEYS: FieldDataKey[] = [
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
			<Heading as="h1" size="2xl" w="full" mb={4}>
				Boiler
			</Heading>
			<Formik
				initialValues={INITIAL_VAL}
				onSubmit={(values: Partial<TrigenInputDataType>) => {
					updateFormValue(values)
				}}>
				{({ submitForm }) => (
					<Form>
						<Box p={4} borderWidth="1px" borderRadius="md" overflow="hidden">
							<VStack>
								<Heading as="h2" w="full" mb={4}>
									ข้อมูล Boiler
								</Heading>
								{Object.keys(INITIAL_VAL).map((key) => (
									<FormField name={key as FieldDataKey} key={key} />
								))}
								<Divider />
								{/* <Heading as="h2" w="full" mb={4}>
									Steam Outlet
								</Heading> */}
								<Table>
									<TableCaption placement="top">Steam Outlet</TableCaption>
									<Tbody>
										<Tr>
											<Td>{FIELD_DATA['prod_steam_pressure'].label}</Td>
											<Td isNumeric>0</Td>
											<Td>{FIELD_DATA['prod_steam_pressure'].addonText}</Td>
										</Tr>
										<Tr>
											<Td>{FIELD_DATA['prod_steam_temp'].label}</Td>
											<Td isNumeric>0</Td>
											<Td>{FIELD_DATA['prod_steam_temp'].addonText}</Td>
										</Tr>
										<Tr>
											<Td>{FIELD_DATA['prod_steam_volume'].label}</Td>
											<Td isNumeric>0</Td>
											<Td>{FIELD_DATA['prod_steam_volume'].addonText}</Td>
										</Tr>
										<Tr>
											<Td>Steam Enthalpy</Td>
											<Td isNumeric>0</Td>
											<Td>kJ/kg</Td>
										</Tr>
										<Tr>
											<Td>Feedwater Enthalpy</Td>
											<Td isNumeric>0</Td>
											<Td>kJ/kg</Td>
										</Tr>
									</Tbody>
								</Table>
							</VStack>
						</Box>

						{/* <Box p={4} borderWidth="1px" borderRadius="md" overflow="hidden">
							<VStack></VStack>
						</Box> */}

						<FormActionButton submitForm={submitForm} nextStep={nextStep} prevStep={prevStep} />
					</Form>
				)}
			</Formik>
		</>
	)
}

export default Section2
