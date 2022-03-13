import { Box, Button, Flex, Spacer } from '@chakra-ui/react'

const FormActionButton = ({
	submitForm,
	nextStep,
	prevStep,
}: {
	submitForm: () => any
	nextStep?: () => void
	prevStep?: () => void
}) => {
	return (
		<>
			<Box mt={8}></Box>
			<Flex>
				{prevStep && (
					<Button
						onClick={() => {
							submitForm()
							prevStep()
						}}>
						&laquo;
					</Button>
				)}
				<Spacer />
				{nextStep && (
					<Button
						onClick={() => {
							submitForm()
							nextStep()
						}}>
						&raquo;
					</Button>
				)}
			</Flex>
		</>
	)
}

export default FormActionButton
