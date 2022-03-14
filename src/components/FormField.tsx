import { FIELD_DATA, FieldDataKey } from 'data/fieldData'

import { Controller, Control } from 'react-hook-form'
import FormInput from './FormInput'

const FormField = ({ name, control }: { name: FieldDataKey; control: Control<any, any> }) => {
	return (
		<Controller
			{...{ name, control }}
			render={({ field }: any) => (
				<FormInput
					inputId={name}
					label={FIELD_DATA[name]?.label ?? ''}
					placeholder={
						FIELD_DATA[name]?.placeholder ??
						`${FIELD_DATA[name]?.label} (${FIELD_DATA[name]?.addonText})`
					}
					addonText={FIELD_DATA[name]?.addonText ?? ''}
					inputProps={field}
				/>
			)}
		/>
	)
}

export default FormField
