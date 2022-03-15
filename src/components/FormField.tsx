import { FIELD_DATA, FieldDataKey } from 'data/fieldData'

import { UseFormRegister, FormState } from 'react-hook-form'
import { TrigenInputDataType } from 'types/trigenTypes'
import FormInput from './FormInput'

const FormField = ({
	name,
	register,
	errors,
}: {
	name: FieldDataKey
	register: UseFormRegister<TrigenInputDataType>
	errors: FormState<TrigenInputDataType>['errors']
}) => {
	return (
		<FormInput
			inputId={name}
			label={FIELD_DATA[name]?.label ?? ''}
			placeholder={
				FIELD_DATA[name]?.placeholder ??
				`${FIELD_DATA[name]?.label} (${FIELD_DATA[name]?.addonText})`
			}
			addonText={FIELD_DATA[name]?.addonText ?? ''}
			inputProps={register(name, {
				required: true,
				min: 0,
				max: 100,
			})}
			error={JSON.stringify(errors[name])}
		/>
	)
}

export default FormField
