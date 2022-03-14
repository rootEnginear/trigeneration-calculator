import { TrigenInputDataType } from 'types/trigenTypes'

import { useMemo, useState } from 'react'
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
import { useForm, Controller } from 'react-hook-form'

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

let rerender = 0
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

	const { control, watch, handleSubmit } = useForm<TrigenInputDataType>({
		defaultValues: INITIAL_VAL,
	})

	const formatDigits = (value: number, decimal = 4, roundingFunction = Math.ceil): string => {
		return (roundingFunction(value * Math.pow(10, decimal)) / Math.pow(10, decimal)).toFixed(
			decimal
		)
	}

	const nullGuarding = <T,>(value: T | null): T | JSX.Element => {
		if (value === null)
			return (
				<Alert status="error">
					<AlertDescription>Error!</AlertDescription>
				</Alert>
			)
		return value
	}

	/* nullguard & format 4 */
	const $f = (value: number | null, digits = 4): JSX.Element => {
		const nullGuard = nullGuarding(value)
		if (typeof nullGuard === 'number') return <>{formatDigits(nullGuard, digits)}</>
		return nullGuard
	}

	const calcSteamEnthalpy = (p: number | string | undefined, T: number | string | undefined) => {
		const _p = +(p ?? 0) + 1
		const _T = +(T ?? 0) + 1
		try {
			return h_pT(_p, _T)
		} catch {
			return null
		}
	}

	const values = watch()

	const steam_enthalpy = calcSteamEnthalpy(values.prod_steam_pressure, values.prod_steam_temp)
	const feedwater_enthalpy = calcSteamEnthalpy(values.prod_steam_pressure, values.input_steam_temp)
	const fuel_usage_rate = (() => {
		try {
			const { prod_steam_volume, boiler_efficiency } = values
			const lhv = FUEL_DATA[values.fuel_type ?? 'ไม้สับ'].lhv
			const steam_ent = h_pT(+(values.prod_steam_pressure ?? 0) + 1, +(values.prod_steam_temp ?? 0))
			const feed_ent = h_pT(+(values.prod_steam_pressure ?? 0) + 1, +(values.input_steam_temp ?? 0))

			return (
				((prod_steam_volume ?? 0) * (steam_ent - feed_ent)) /
				((lhv * (boiler_efficiency ?? 0)) / 100)
			)
		} catch {
			return null
		}
	})()
	const fuel_cost = Math.ceil(
		(FUEL_DATA[values.fuel_type ?? 'ไม้สับ'].price * (fuel_usage_rate || 0)) /
			+values.prod_steam_volume
	)
	const other_cost = Math.ceil(fuel_cost * 0.3)
	const total_cost = fuel_cost + other_cost

	const saveData = (values: Partial<TrigenInputDataType>) => {
		updateFormValue({
			...values,
			steam_enthalpy,
			feedwater_enthalpy,
			fuel_usage_rate,
			fuel_cost,
			other_cost,
			total_cost,
		})
	}

	return (
		<>
			<Heading as="h1" size="2xl" w="full" mb={4}>
				Boiler {rerender++}
			</Heading>
			<form>
				<Box p={4} borderWidth="1px" borderRadius="md" overflow="hidden">
					<VStack spacing={4}>
						<Heading as="h2" w="full">
							ข้อมูล Boiler
						</Heading>
						<SimpleGrid columns={2} spacing={4} w="full">
							{Object.keys(INITIAL_VAL)
								.filter((e) => e !== 'fuel_type')
								.map((key) => (
									<FormField name={key as FieldDataKey} control={control} key={key} />
								))}
						</SimpleGrid>
						<Divider />
						<Heading as="h2" w="full">
							Steam Outlet
						</Heading>
						<Table>
							<Tbody>
								<Tr>
									<Td>{FIELD_DATA['prod_steam_pressure']?.label}</Td>
									<Td isNumeric>{values.prod_steam_pressure}</Td>
									<Td>{FIELD_DATA['prod_steam_pressure']?.addonText}</Td>
								</Tr>
								<Tr>
									<Td>{FIELD_DATA['prod_steam_temp']?.label}</Td>
									<Td isNumeric>{values.prod_steam_temp}</Td>
									<Td>{FIELD_DATA['prod_steam_temp']?.addonText}</Td>
								</Tr>
								<Tr>
									<Td>{FIELD_DATA['prod_steam_volume']?.label}</Td>
									<Td isNumeric>{values.prod_steam_volume}</Td>
									<Td>{FIELD_DATA['prod_steam_volume']?.addonText}</Td>
								</Tr>
								<Tr>
									<Td>เอลทาลปีไอน้ำ</Td>
									<Td isNumeric>{$f(steam_enthalpy)}</Td>
									<Td>kJ/kg</Td>
								</Tr>
								<Tr>
									<Td>เอลทาลปีน้ำป้อนเข้า</Td>
									<Td isNumeric>{$f(feedwater_enthalpy)}</Td>
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
									<Td>{FIELD_DATA['fuel_type']?.label}</Td>
									<Td>
										<Controller
											name="fuel_type"
											control={control}
											render={({ field }: any) => (
												<Select {...field}>
													{Object.keys(FUEL_DATA).map((fuel_type) => (
														<option value={fuel_type} key={fuel_type}>
															{fuel_type}
														</option>
													))}
												</Select>
											)}
										/>
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
									<Th isNumeric>{$f(fuel_usage_rate)}</Th>
									<Th>ตัน/ชั่วโมง</Th>
								</Tr>
							</Tfoot>
						</Table>
						<Divider />
						<Heading as="h2" w="full">
							รายละเอียดต้นทุน Steam
						</Heading>
						<Table>
							<Thead>
								<Tr>
									<Th>รายการ</Th>
									<Th>เป็นเงิน</Th>
									<Th>หน่วย</Th>
								</Tr>
							</Thead>
							<Tbody>
								<Tr>
									<Td>ค่าเชื้อเพลิง</Td>
									<Td isNumeric>{$f(fuel_cost, 0)}</Td>
									<Td>บาท/ตัน</Td>
								</Tr>
								<Tr>
									<Td>อื่นๆ 30%</Td>
									<Td isNumeric>{$f(other_cost, 0)}</Td>
									<Td>บาท/ตัน</Td>
								</Tr>
							</Tbody>
							<Tfoot>
								<Tr>
									<Th>รวมต้นทุนทั้งหมด</Th>
									<Th isNumeric>{$f(total_cost, 0)}</Th>
									<Th>บาท/ตัน</Th>
								</Tr>
							</Tfoot>
						</Table>
					</VStack>
				</Box>

				{/* <Box p={4} borderWidth="1px" borderRadius="md" overflow="hidden">
							<VStack></VStack>
						</Box> */}

				<FormActionButton
					submitForm={handleSubmit(saveData)}
					nextStep={nextStep}
					prevStep={prevStep}
				/>
			</form>
		</>
	)
}

export default Section2
