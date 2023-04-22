import React from 'react'
export const CustomDropdown = (props) => (
  <div className="form-group">
    <strong>{props.code}</strong>
    <select
      className="form-control"
      name="{props.code}"
      onChange={props.onChange}
    >
      <option defaultValue>Select {props.code}</option>
      {props.options.map((item, index) => (
        <option key={item.code} value={item.code}>
          {item.companyName}
        </option>
      ))}
    </select>
  </div>
)