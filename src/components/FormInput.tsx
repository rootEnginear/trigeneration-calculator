import {
	Input,
	FormControl,
	FormLabel,
	InputGroup,
	InputRightAddon,
	FormErrorMessage,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
} from '@chakra-ui/react'

const FormInput = ({
	inputId,
	placeholder,
	addonText,
	label,
	optional,
	inputProps,
	error,
}: {
	inputId: string
	placeholder: string
	addonText: string
	label: string
	optional?: boolean
	inputProps: {}
	error?: string
}) => {
	return (
		<FormControl isRequired={!optional} isInvalid={!!error}>
			<FormLabel htmlFor={inputId}>{label}</FormLabel>
			<InputGroup>
				<Input {...inputProps} id={inputId} placeholder={placeholder} />
				{/* <NumberInput {...inputProps} id={inputId} placeholder={placeholder}>
					<NumberInputField />
					<NumberInputStepper>
						<NumberIncrementStepper />
						<NumberDecrementStepper />
					</NumberInputStepper>
				</NumberInput> */}
				<InputRightAddon>{addonText}</InputRightAddon>
			</InputGroup>
			{error && <FormErrorMessage>{error}</FormErrorMessage>}
		</FormControl>
	)
}

export default FormInput
