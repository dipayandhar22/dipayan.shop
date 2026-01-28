import { Component, ReactNode } from "react";
export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return <div style={{ padding: 32 }}>Something went wrong.</div>;
    }
    return this.props.children;
  }
}