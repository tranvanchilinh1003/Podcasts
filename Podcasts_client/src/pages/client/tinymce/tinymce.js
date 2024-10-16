import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

const MyEditor = ({ value, onEditorChange }) => {
    return (
        <div className="editor-container rounded-1">
            <Editor
            apiKey="g2iyjej12q33eo50eowchns9r0c5fhvijleqryphx5hi0y24"
            init={{
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
              }}
                value={value}
                onEditorChange={onEditorChange}
            />
        </div>
    );
};

export default MyEditor;
