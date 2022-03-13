import { Input, FormControl, FormLabel, InputGroup, InputRightAddon } from '@chakra-ui/react'

const FormInput = ({
	inputId,
	placeholder,
	addonText,
	label,
	optional,
	inputProps,
}: {
	inputId: string
	placeholder: string
	addonText: string
	label: string
	optional?: boolean
	inputProps: {}
}) => {
	return (
		<FormControl isRequired={!optional}>
			<FormLabel htmlFor={inputId}>{label}</FormLabel>
			<InputGroup>
				<Input {...inputProps} id={inputId} placeholder={placeholder} />
				<InputRightAddon>{addonText}</InputRightAddon>
			</InputGroup>
		</FormControl>
	)
}

export default FormInput
