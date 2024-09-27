import React from 'react';
import { Editor } from '@tinymce/tinymce-react';


const MyEditor = ({ value, onEditorChange }) => {
    return (
        <div className="editor-container border border-dark rounded-1 ">
            <Editor
                apiKey="6w2dyd9i3vjn3yqoolo3l15z32xfkzf24pfrf45b606pwj2m" // Replace with your TinyMCE API key
                value={value}
                // init={{
                //     height: 250,
                //     menubar: false,
                //     plugins: [
                //         'advlist autolink lists link image charmap print preview anchor',
                //         'searchreplace visualblocks code fullscreen',
                //         'insertdatetime media table paste code  wordcount',
                //     ],
                //     toolbar:
                //         'undo redo | styleselect | bold italic backcolor | ' +
                //         'alignleft aligncenter alignright alignjustify | ' +
                //         'bullist numlist outdent indent | link image | ' +
                //         'preview save | help',
                // }}
                init={{
                    height: 300,
                    plugins: [
                        // Core editing features
                        'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                        // Your account includes a free trial of TinyMCE premium features
                        // Try the most popular premium features until Oct 10, 2024:
                        'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown',
                    ],
                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                    tinycomments_mode: 'embedded',
                    tinycomments_author: 'Author name',
                    mergetags_list: [
                        { value: 'First.Name', title: 'First Name' },
                        { value: 'Email', title: 'Email' },
                    ],
                    ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                }}
                onEditorChange={onEditorChange}
            />
        </div>
    );
};

export default MyEditor;
