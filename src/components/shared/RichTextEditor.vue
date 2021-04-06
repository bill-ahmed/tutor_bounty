<template>
<v-container fluid id="rich_text_editor_container">
    <editor-menu-bar id="rich_text_editor_toolbar" :editor="editor" v-slot="{ commands, isActive }">
      <v-toolbar v-if="canEdit()" dense flat>
        <v-btn small text icon
          class="menubar__button"
          :color="getColor(isActive.bold())"
          @click="commands.bold"
        >
          <v-icon small> fa fa-bold </v-icon>
        </v-btn>

        <v-btn small text icon
          class="menubar__button"
          :color="getColor(isActive.italic())"
          @click="commands.italic"
        >
          <v-icon small> fa fa-italic </v-icon>
        </v-btn>

        <v-btn small text icon
          class="menubar__button"
          :color="getColor(isActive.strike())"
          @click="commands.strike"
        >
          <v-icon small> fa fa-strikethrough </v-icon>
        </v-btn>

        <v-btn small text icon
          class="menubar__button"
          :color="getColor(isActive.underline())"
          @click="commands.underline"
        >
          <v-icon small> fa fa-underline </v-icon>
        </v-btn>

        <div class="mx-2"></div>

        <v-btn small text icon
          class="menubar__button"
          :color="getColor(isActive.paragraph())"
          @click="commands.paragraph"
        >
          <v-icon small> fa fa-paragraph </v-icon>
        </v-btn>

        <v-btn small text
          class="menubar__button"
          :color="getColor(isActive.heading({ level: 1 }))"
          @click="commands.heading({ level: 1 })"
        >
          H1
        </v-btn>

        <v-btn small text
          class="menubar__button"
          :color="getColor(isActive.heading({ level: 2 }))"
          @click="commands.heading({ level: 2 })"
        >
          H2
        </v-btn>

        <v-btn small text
          class="menubar__button"
          :color="getColor(isActive.heading({ level: 3 }))"
          @click="commands.heading({ level: 3 })"
        >
          H3
        </v-btn>

        <div class="mx-2"></div>

        <v-btn small text icon
          class="menubar__button"
          :color="getColor(isActive.bullet_list())"
          @click="commands.bullet_list"
        >
          <v-icon small> fa fa-list-ul </v-icon>
        </v-btn>

        <v-btn small text icon
          class="menubar__button"
          :color="getColor(isActive.ordered_list())"
          @click="commands.ordered_list"
        >
          <v-icon small> fa fa-list-ol </v-icon>
        </v-btn>

        <div class="mx-2"></div>

        <v-btn small text icon
          class="menubar__button"
          :color="getColor(isActive.blockquote())"
          @click="commands.blockquote"
        >
          <v-icon small> fa fa-quote-right </v-icon>
        </v-btn>
        
        <v-btn small text icon
          class="menubar__button"
          :color="getColor(isActive.code())"
          @click="commands.code"
        >
          <v-icon small> fa fa-code </v-icon>
        </v-btn>

        <v-btn small text icon
          class="menubar__button"
          :color="getColor(isActive.code_block())"
          @click="commands.code_block"
        >
          <v-icon small> fa fa-file-code </v-icon>
        </v-btn>

        <div class="mx-2"></div>

        <v-btn small text
          class="menubar__button"
          @click="commands.horizontal_rule"
        >
          —
        </v-btn>

        <v-btn small text icon
          class="menubar__button"
          @click="commands.undo"
        >
          <v-icon small> fa fa-undo </v-icon>
        </v-btn>

        <v-btn small text icon
          class="menubar__button"
          @click="commands.redo"
        >
          <v-icon small> fa fa-redo </v-icon>
        </v-btn>

      </v-toolbar>
    </editor-menu-bar>

    <editor-content class="editor__content" :style="restrictHeight ? 'max-height: 60vh;' : ''" :editor="editor" />
  </v-container>
</template>

<script lang="ts">
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Blockquote,
  BulletList,
  Heading,
  Italic,
  Bold,
  Link,
  HardBreak,
  History,
  Code,
  CodeBlock,
  HorizontalRule,
  ListItem,
  OrderedList,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  Underline,
  Strike,
  TrailingNode
} from 'tiptap-extensions'

export default {
  components: {
    EditorContent,
    EditorMenuBar
  },
  props: ['value', 'content', 'isEditable', 'restrictHeight'],
  data(){
    return {
      editor: new Editor({
        editable: this.isEditable == null ? true : this.isEditable,
        content: this.content ?? '<p> Add a description... </p>',
        onUpdate: ({ getHTML }) => {
          this.$emit('input', getHTML());
        },
        extensions: [
          new Blockquote(),
          new BulletList(),
          new Heading({ levels: [1, 2, 3] }),
          new Italic(),
          new Bold(),
          new Link(),
          new HardBreak(),
          new History(),
          new Code(),
          new CodeBlock(),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new Table(),
          new TableHeader(),
          new TableCell(),
          new TableRow(),
          new Underline(),
          new Strike(),
          new TrailingNode({
            node: 'paragraph',
            notAfter: ['paragraph'],
          }),
        ]
      }),
    }
  },
  methods: {
    getColor(isActive: boolean) {
      return isActive ? 'primary' : '';
    },
    canEdit(): boolean {
      return this.isEditable || this.isEditable == null;
    }
  },
  beforeDestroy() {
    this.editor.destroy();
  }
}
</script>

<style lang="scss">
#rich_text_editor_container {
  padding: 0;

  #rich_text_editor_toolbar {
    .v-btn {
      margin: 2px;
    }

    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
}

.editor__content {
  // border: solid 1px rgba(0, 0, 0, 0.3);
  // border-radius: 5px;

  // border-top: none;
  // border-top-left-radius: 0;
  // border-top-right-radius: 0;

  margin-top: 1px;

  padding: 10px;

  min-height: 300px;

  overflow-y: scroll;

  .ProseMirror {
    min-height: 300px;
    height: 100%;
  }



  p {
    font-family: Calibri, Roboto;
    font-size: 13pt;
  }

  pre {
    background-color: #F6F8FA;
    border-radius: 5px;

    padding: 5px 10px;
    margin-bottom: 5px;
  }

  blockquote {
    margin-left: 10px;
    padding-left: 10px;

    color: rgba(0, 0, 0, 0.8);

    border-left: solid 4px #E5E5E5;

    font-style: italic;

    p {
      margin-bottom: 3px;
    }
  }
  
  li p {
    margin-bottom: 0;
  }
}

.ProseMirror:focus {
  outline: none;
}
</style>
