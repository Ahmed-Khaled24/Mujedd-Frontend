import React from 'react';

import { DeleteTagButton, TagContainer } from './tag.styles';

type TagProps = {
    text: string;
    deletable?: boolean;
    size?: string;
    deleteHandler?: React.MouseEventHandler;
    clickHandler?: React.MouseEventHandler;
};

const Tag = ({
    text,
    deletable,
    size,
    deleteHandler,
    clickHandler,
}: TagProps) => {
    return (
        <TagContainer size={size} deletable={deletable} onClick={clickHandler}>
            {text}
            {deletable && (
                <DeleteTagButton onClick={deleteHandler} title="Delete">
                    ✕
                </DeleteTagButton>
            )}
        </TagContainer>
    );
};

export default Tag;
