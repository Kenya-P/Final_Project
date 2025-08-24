import { useState, useCallback } from 'react';

const validationConfig = {
    required: {
        isValid: (value) => !!value,
        errorMessage: 'This field is required',
    },
    email: {
        isValid: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        errorMessage: 'Invalid email address',
    },
    password: {
        isValid: (value) => value.length >= 6,
        errorMessage: 'Password must be at least 6 characters long',
    },
    url: {
        isValid: (value) => /^(https?:\/\/[^\s$.?#].[^\s]*)$/.test(value),
        errorMessage: 'Invalid URL',
    },
    avatar: {
        isValid: (value) => /^(https?:\/\/[^\s$.?#].[^\s]*)$/.test(value),
        errorMessage: 'Invalid avatar URL',
    },
};

export function useFormAndValidation(initialValues = {}) {
    // Initialize state for form values, errors, and validity
    // using the initial values passed to the hook
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [isValid, setIsValid] = useState(false);

    const validateField = useCallback((name, value) => {
        const rule = validationConfig[name];
        if (rule && !rule.isValid(value)) {
            return rule.errorMessage;
        }
        if (!value) {
            return 'This field is required';
        }
        return '';
    }, []);

    const validateForm = useCallback((formValues) => {
        let valid = true;
        const newErrors = {};

        for (const [name, value] of Object.entries(formValues)) {
            const error = validateField(name, value);
            if (error) {
                newErrors[name] = error;
                valid = false;
            }
        }

        setErrors(newErrors);
        return valid;
    }, [validateField]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        const newValues = { ...values, [name]: value };
        setValues(newValues);

        const error = validateField(name, value);
        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));

        setIsValid(validateForm(newValues));
    }, [values, validateField, validateForm]);

    const resetForm = () => {
        setValues({});
        setErrors({});
        setIsValid(false);
    };

    return {
        values,
        handleChange,
        errors,
        isValid,
        resetForm,
        setValues,
        setErrors,
    };
}