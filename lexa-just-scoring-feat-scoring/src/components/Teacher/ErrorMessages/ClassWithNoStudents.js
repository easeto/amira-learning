import React from 'react';

export default function ClassWithNoStudents () {
  return (
    <div className="teacherNoStudentsNotice">
      <div>No students are rostered in this class.</div>
      <div>Ask your admin to finish rostering before using the Amira teacher app.</div>
    </div>
  );
}