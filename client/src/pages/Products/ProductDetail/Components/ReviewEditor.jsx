import { Button, Form, Input, message, Rate } from "antd";
import TextArea from "antd/lib/input/TextArea";
import Text from "antd/lib/typography/Text";
import useListItem from "components/hooks/useListItem";
import React, { useState } from "react";

const ReviewEditor = ({ handleSubmit }) => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [rate, setRate] = useState(5);

  const onSubmit = () => {
    if (title === "") {
      message.warn("Title cannot empty");
      return;
    }
    if (rate === 0) {
      message.warn("Choose number of stars");
      return;
    }

    handleSubmit(title, content, rate);
    setContent("");
    setTitle("");
    setRate(5);
  };

  return (
    <div>
      <Text style={{ width: 300 }} strong>
        Title
      </Text>
      <Input
        rows={4}
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <Text style={{ width: 300 }} strong>
        Content
      </Text>
      <TextArea
        rows={4}
        onChange={(e) => setContent(e.target.value)}
        value={content}
      />
      <Text style={{ width: 300 }} strong>
        Your rating
      </Text>
      <Form.Item>
        <Rate
          value={rate}
          style={{ background: "#fff", padding: "0px 10px 5px 10px"}}
          onChange={(value) => setRate(value)}
        />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" onClick={onSubmit} type="primary">
          Add review
        </Button>
      </Form.Item>
    </div>
  );
};

export default ReviewEditor;
