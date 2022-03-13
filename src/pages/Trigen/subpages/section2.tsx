import { TrigenInputDataType } from 'types/trigenTypes'

import {
	Heading,
	Box,
	VStack,
	Divider,
	Table,
	Tbody,
	Tr,
	Td,
	Select,
	Alert,
	AlertDescription,
	SimpleGrid,
	Thead,
	Tfoot,
	Th,
} from '@chakra-ui/react'

import FormField from 'components/FormField'
import FormActionButton from 'components/FromActionButton'
import { Formik, Form, Field } from 'formik'

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
	'fuel_type',
]

import { h_pT } from 'utils/xsteam'
import { FUEL_DATA } from 'data/fuelData'
const calc_h_pT = (p: number, T: number) => {
	try {
		return <span>{h_pT(p, T).toFixed(4)}</span>
	} catch (e) {
		return (
			<Alert status="error">
				<AlertDescription>Error!</AlertDescription>
			</Alert>
		)
	}
}

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
				{({ submitForm, values }) => (
					<Form>
						<Box p={4} borderWidth="1px" borderRadius="md" overflow="hidden">
							<VStack spacing={4}>
								<Heading as="h2" w="full">
									ข้อมูล Boiler
								</Heading>
								<SimpleGrid columns={2} spacing={4} w="full">
									{Object.keys(INITIAL_VAL)
										.filter((e) => e !== 'fuel_type')
										.map((key) => (
											<FormField name={key as FieldDataKey} key={key} />
										))}
								</SimpleGrid>
								<Divider />
								<Heading as="h2" w="full">
									Steam Outlet
								</Heading>
								<Table>
									<Tbody>
										<Tr>
											<Td>{FIELD_DATA['prod_steam_pressure'].label}</Td>
											<Td isNumeric>{values.prod_steam_pressure}</Td>
											<Td>{FIELD_DATA['prod_steam_pressure'].addonText}</Td>
										</Tr>
										<Tr>
											<Td>{FIELD_DATA['prod_steam_temp'].label}</Td>
											<Td isNumeric>{values.prod_steam_temp}</Td>
											<Td>{FIELD_DATA['prod_steam_temp'].addonText}</Td>
										</Tr>
										<Tr>
											<Td>{FIELD_DATA['prod_steam_volume'].label}</Td>
											<Td isNumeric>{values.prod_steam_volume}</Td>
											<Td>{FIELD_DATA['prod_steam_volume'].addonText}</Td>
										</Tr>
										<Tr>
											<Td>Steam Enthalpy</Td>
											<Td isNumeric>
												{calc_h_pT(
													+(values.prod_steam_pressure ?? 0) + 1,
													+(values.prod_steam_temp ?? 0)
												)}
											</Td>
											<Td>kJ/kg</Td>
										</Tr>
										<Tr>
											<Td>Feedwater Enthalpy</Td>
											<Td isNumeric>
												{calc_h_pT(
													+(values.prod_steam_pressure ?? 0) + 1,
													+(values.input_steam_temp ?? 0)
												)}
											</Td>
											<Td>kJ/kg</Td>
										</Tr>
									</Tbody>
								</Table>
								<Divider />
								<Heading as="h2" w="full">
									ข้อมูลเชื้อเพลิง
								</Heading>
								<Table>
									<Thead>
										<Tr>
											<Th colSpan={2}>ข้อมูลเชื้อเพลิง</Th>
											<Th>หน่วย</Th>
										</Tr>
									</Thead>
									<Tbody>
										<Tr>
											<Td>{FIELD_DATA['fuel_type'].label}</Td>
											<Td>
												<Field name="fuel_type">
													{({ field }: any) => (
														<Select {...field}>
															{Object.keys(FUEL_DATA).map((fuel_type) => (
																<option value={fuel_type} key={fuel_type}>
																	{fuel_type}
																</option>
															))}
														</Select>
													)}
												</Field>
											</Td>
											<Td></Td>
										</Tr>
										<Tr>
											<Td>ค่า LHV</Td>
											<Td isNumeric>{FUEL_DATA[values.fuel_type ?? 'ไม้สับ'].lhv}</Td>
											<Td>kJ/kg</Td>
										</Tr>
										<Tr>
											<Td>ค่าเชื้อเพลิง</Td>
											<Td isNumeric>{FUEL_DATA[values.fuel_type ?? 'ไม้สับ'].price}</Td>
											<Td>บาท/ตัน</Td>
										</Tr>
									</Tbody>
									<Tfoot>
										<Tr>
											<Th>อัตราการใช้เชื้อเพลิง</Th>
											<Th isNumeric>
												{(() => {
													try {
														const { prod_steam_volume, boiler_efficiency } = values
														const lhv = FUEL_DATA[values.fuel_type ?? 'ไม้สับ'].lhv
														const steam_ent = h_pT(
															+(values.prod_steam_pressure ?? 0) + 1,
															+(values.prod_steam_temp ?? 0)
														)
														const feed_ent = h_pT(
															+(values.prod_steam_pressure ?? 0) + 1,
															+(values.input_steam_temp ?? 0)
														)
														return (
															((prod_steam_volume ?? 0) * (steam_ent - feed_ent)) /
															((lhv * (boiler_efficiency ?? 0)) / 100)
														).toFixed(4)
													} catch {
														return (
															<Alert status="error">
																<AlertDescription>Error!</AlertDescription>
															</Alert>
														)
													}
												})()}
											</Th>
											<Th>ตัน/ชั่วโมง</Th>
										</Tr>
									</Tfoot>
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
