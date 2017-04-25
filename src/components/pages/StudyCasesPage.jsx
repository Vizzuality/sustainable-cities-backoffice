import React from 'react';
import { Link } from 'react-router';

export default class StudyCasesPage extends React.Component {
  render() {
    return (
      <div>
        <Link className="button" to="/study-cases/new">New study case</Link>
      </div>
    );
  }
}
