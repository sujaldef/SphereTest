/**
 * DashboardQuestionPage - Question Management Page
 *
 * This page allows sphere creators to add,  edit, and manage questions.
 * Currently delegates to Selectquestions component.
 *
 * TODO: Refactor Selectquestions into proper logic/UI separation
 */

import Selectquestions from '../Selectquestions';

export default function DashboardQuestionPage() {
  return <Selectquestions />;
}
