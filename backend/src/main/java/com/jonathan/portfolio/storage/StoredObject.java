package com.jonathan.portfolio.storage;

import java.nio.file.Path;

/** A stored media file, described rather than loaded: the bytes are streamed straight from disk. */
public record StoredObject(Path path,long size,String contentType) {}
