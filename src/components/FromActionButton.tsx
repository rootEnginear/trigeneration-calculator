import { Box, Button, Flex, Spacer } from '@chakra-ui/react'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'

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
						leftIcon={<ArrowBackIcon />}
						onClick={() => {
							submitForm()
							prevStep()
						}}>
						ย้อนกลับ
					</Button>
				)}
				<Spacer />
				{nextStep && (
					<Button
						rightIcon={<ArrowForwardIcon />}
						onClick={() => {
							submitForm()
							nextStep()
						}}>
						ถัดไป
					</Button>
				)}
			</Flex>
		</>
	)
}

export default FormActionButton
