import styled, { css } from 'styled-components';

import { CSSTextLengthLimit } from '../../index.styles';

const commonInputStyles = css<{ error?: string }>`
    border: 1px solid var(--gray-600);
    padding: 0.5rem;
    min-width: 0;
    border-radius: 0.25rem;
    font-size: 0.875rem;

    outline-color: ${({ error }) => (error ? 'red' : 'var(--indigo-700)')};

    &:focus-visible {
        outline: 1px solid var(--indigo-700);
    }
`;

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0rem;
`;

export const GridContainer = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 5fr);
    row-gap: 1.5rem;
    column-gap: 0.5rem;
    align-items: center;
`;

export const Label = styled.label<{ width?: string }>`
    font-size: 0.875rem;
    font-weight: bold;
    ${CSSTextLengthLimit}
`;

export const TextAreaContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0rem;
`;

export const Input = styled.input<{ error?: string }>`
    ${commonInputStyles}
`;

export const Textarea = styled.textarea<{ error?: string }>`
    ${commonInputStyles}
`;

export const TextareaCounter = styled.span`
    font-family: 'JetBrains Mono', 'monospace';
    font-size: 0.65rem;
    color: var(--gray-700);
    align-self: flex-end;
`;