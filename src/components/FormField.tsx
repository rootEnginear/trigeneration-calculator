import { FIELD_DATA, FieldDataKey } from 'data/fieldData'

import { Field } from 'formik'
import FormInput from './FormInput'

const FormField = ({ name }: { name: FieldDataKey }) => {
	return (
		<Field name={name} key={name}>
			{({ field }: any) => (
				<FormInput
					inputId={name}
					label={FIELD_DATA[name].label ?? ''}
					placeholder={
						FIELD_DATA[name].placeholder ??
						`${FIELD_DATA[name].label} (${FIELD_DATA[name].addonText})`
					}
					addonText={FIELD_DATA[name].addonText ?? ''}
					inputProps={field}
				/>
			)}
		</Field>
	)
}

export default FormField
