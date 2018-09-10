import React from 'react';

const AuthenticationFailed = () => (
    <div className="full-height relative background-info">
        <div className="valign-wrapper center-align full-height todo-div">
            <div className="full-width">
                <i className="material-icons">lock_outline</i>
                <div>You dont have access to this area.</div>
            </div>
        </div>
    </div>
);
export default AuthenticationFailed;
